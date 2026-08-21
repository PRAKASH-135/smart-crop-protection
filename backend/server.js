require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Log = require("./models/Log");
const Crop = require("./models/Crop");

console.log("GMAIL_USER loaded:", process.env.GMAIL_USER);
console.log("APP_PASSWORD loaded:", process.env.GMAIL_APP_PASSWORD ? "yes (hidden)" : "MISSING");
console.log("OWNER_EMAIL loaded:", process.env.OWNER_EMAIL);

const app = express();

app.use(cors());

mongoose.connect(
  "mongodb://127.0.0.1:27017/crop-protection"
);

const upload = multer({ dest: "uploads/" });

let rulesCache = {};

async function loadRules() {
  const crops = await Crop.find();
  rulesCache = {};
  crops.forEach(c => { rulesCache[c.name] = c.harmful; });
}

loadRules();
setInterval(loadRules, 30000);

const activeTracks = new Map();
const TRACK_TIMEOUT_MS = 5000;
const HIGH_THREAT_SECONDS = 10;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

let lastEmailSent = 0;
const EMAIL_COOLDOWN_MS = 60000;

async function sendAlertEmail(objectLabel, crop, threatLevel, imagePath) {
  const now = Date.now();
  if (now - lastEmailSent < EMAIL_COOLDOWN_MS) {
    console.log("Email skipped (cooldown active).");
    return;
  }
  lastEmailSent = now;

  const detectedTime = new Date().toLocaleString();

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.OWNER_EMAIL,
      subject: `Crop Alert: ${objectLabel} detected (${threatLevel})`,
      text: `A ${objectLabel} was detected in your ${crop} field.\nThreat level: ${threatLevel}\nTime: ${detectedTime}`,
      attachments: imagePath ? [
        {
          filename: "detection.jpg",
          path: imagePath
        }
      ] : []
    });
    console.log("Alert email sent. Full response:");
    console.log("  accepted:", info.accepted);
    console.log("  rejected:", info.rejected);
    console.log("  response:", info.response);
    console.log("  messageId:", info.messageId);
  } catch (err) {
    console.log("Email send failed:", err.message);
  }
}

app.post("/api/analyze", upload.single("image"), async (req, res) => {

  let detectedObject = "none";
  let confidence = 0;
  let harmful = false;
  let threatLevel = "SAFE";

  try {

    const crop = req.body.crop;
    const zone = req.body.zone ? JSON.parse(req.body.zone) : null;
    const now = Date.now();

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "http://127.0.0.1:8000/detect",
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    const detections = response.data.detections || [];
    const imgW = response.data.imageWidth || 640;
    const imgH = response.data.imageHeight || 480;

    const inZone = (d) => {
      if (!zone) return true;
      const cx = ((d.boundingBox.x1 + d.boundingBox.x2) / 2 / imgW) * 100;
      const cy = ((d.boundingBox.y1 + d.boundingBox.y2) / 2 / imgH) * 100;
      return cx >= zone.left && cx <= zone.left + zone.width &&
             cy >= zone.top && cy <= zone.top + zone.height;
    };

    const zoneDetections = detections.filter(inZone);

    for (const [id, t] of activeTracks.entries()) {
      if (now - t.lastSeen > TRACK_TIMEOUT_MS) {
        activeTracks.delete(id);
      }
    }

    const newSightings = [];
    for (const d of zoneDetections) {
      if (d.trackId !== null && d.trackId !== undefined) {
        const isIntruderNow = d.label === "person"
          ? d.isOwner === false
          : rulesCache[crop]?.includes(d.label.toLowerCase()) || false;

        if (!activeTracks.has(d.trackId)) {
          newSightings.push(d);
          activeTracks.set(d.trackId, { firstSeen: now, lastSeen: now, wasHarmful: isIntruderNow });
        } else {
          const t = activeTracks.get(d.trackId);
          if (isIntruderNow && !t.wasHarmful) {
            newSightings.push(d);
          }
          t.lastSeen = now;
          t.wasHarmful = isIntruderNow;
        }
      }
    }

    if (zoneDetections.length > 0) {
      const harmfulDetection = zoneDetections.find((d) => {
        if (d.label === "person") {
          return d.isOwner === false;
        }
        return rulesCache[crop]?.includes(d.label.toLowerCase());
      });

      if (harmfulDetection) {
        detectedObject = harmfulDetection.label;
        confidence = harmfulDetection.confidence;
        harmful = true;

        const track = activeTracks.get(harmfulDetection.trackId);
        const dwellSeconds = track ? (now - track.firstSeen) / 1000 : 0;
        threatLevel = dwellSeconds >= HIGH_THREAT_SECONDS ? "HIGH" : "WARNING";
      } else {
        const topDetection = zoneDetections.reduce((a, b) =>
          a.confidence > b.confidence ? a : b
        );
        detectedObject = topDetection.label;
        confidence = topDetection.confidence;
        harmful = false;
      }
    }

    const personDetections = zoneDetections.filter(d => d.label === "person");

    console.log({
      crop,
      detectedObject,
      harmful,
      threatLevel,
      totalDetections: zoneDetections.length,
      persons: personDetections.map(p => ({
        isOwner: p.isOwner,
        faceConfidence: p.faceConfidence
      }))
    });

    for (const sighting of newSightings) {
      const isIntruder = sighting.label === "person"
        ? sighting.isOwner === false
        : rulesCache[crop]?.includes(sighting.label.toLowerCase()) || false;

      await Log.create({
        object: sighting.label,
        crop,
        harmful: isIntruder,
        confidence: sighting.confidence,
        trackId: sighting.trackId,
        boundingBox: sighting.boundingBox,
        insideCropZone: true,
        threatLevel: isIntruder ? "WARNING" : "SAFE",
        sirenActivated: isIntruder
      });

      if (isIntruder) {
        console.log("Triggering email for:", sighting.label);
        await sendAlertEmail(sighting.label, crop, "WARNING", req.file.path);
      }
    }

    const annotatedDetections = zoneDetections.map(d => ({
      ...d,
      isHarmful: d.label === "person"
        ? d.isOwner === false
        : rulesCache[crop]?.includes(d.label.toLowerCase()) || false
    }));

    res.json({
      detectedObject,
      confidence,
      harmful,
      threatLevel,
      siren: harmful,
      allDetections: annotatedDetections,
      imageWidth: imgW,
      imageHeight: imgH
    });

  } catch (error) {
    console.log("Backend Error:", error.message);
    res.status(500).json({ error: "Detection failed" });
  } finally {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
  }

});

app.get("/api/logs", async (req, res) => {
  try {
    const logs = await Log.find().sort({ time: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

app.get("/api/analytics/detailed", async (req, res) => {
  try {
    const byObject = await Log.aggregate([
      { $match: { harmful: true } },
      { $group: { _id: "$object", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const byDay = await Log.aggregate([
      { $match: { time: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ byObject, byDay });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch detailed analytics" });
  }
});

app.get("/api/analytics", async (req, res) => {
  try {
    const total = await Log.countDocuments();
    const harmful = await Log.countDocuments({ harmful: true });
    const safe = total - harmful;
    res.json({ total, harmful, safe });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});