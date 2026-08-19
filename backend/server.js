const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const mongoose = require("mongoose");
const Log = require("./models/Log");

const app = express();

app.use(cors());

mongoose.connect(
  "mongodb://127.0.0.1:27017/crop-protection"
);

const upload = multer({ dest: "uploads/" });

const rules = {
  rice: ["cow", "monkey", "bird"],
  wheat: ["cow", "monkey", "pig"],
  corn: ["bird", "monkey", "pig"],
  tomato: ["monkey", "bird", "pig"]
};

const activeTracks = new Map();
const TRACK_TIMEOUT_MS = 5000;

app.post("/api/analyze", upload.single("image"), async (req, res) => {

  try {

    const crop = req.body.crop;
    const zone = req.body.zone ? JSON.parse(req.body.zone) : null;

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "http://127.0.0.1:8000/detect",
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    fs.unlink(req.file.path, () => {});

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

    let detectedObject = "none";
    let confidence = 0;
    let harmful = false;

    if (zoneDetections.length > 0) {
      const harmfulDetection = zoneDetections.find((d) =>
        rules[crop]?.includes(d.label.toLowerCase())
      );

      if (harmfulDetection) {
        detectedObject = harmfulDetection.label;
        confidence = harmfulDetection.confidence;
        harmful = true;
      } else {
        const topDetection = zoneDetections.reduce((a, b) =>
          a.confidence > b.confidence ? a : b
        );
        detectedObject = topDetection.label;
        confidence = topDetection.confidence;
        harmful = false;
      }
    }

    const now = Date.now();

    for (const [id, lastSeen] of activeTracks.entries()) {
      if (now - lastSeen > TRACK_TIMEOUT_MS) {
        activeTracks.delete(id);
      }
    }

    const newSightings = [];
    for (const d of zoneDetections) {
      if (d.trackId !== null && d.trackId !== undefined) {
        if (!activeTracks.has(d.trackId)) {
          newSightings.push(d);
        }
        activeTracks.set(d.trackId, now);
      }
    }

    for (const sighting of newSightings) {
      const sightingHarmful =
        rules[crop]?.includes(sighting.label.toLowerCase()) || false;

      await Log.create({
        object: sighting.label,
        crop,
        harmful: sightingHarmful,
        confidence: sighting.confidence
      });
    }

    console.log({
      crop,
      detectedObject,
      harmful,
      totalDetections: zoneDetections.length
    });

    res.json({
      detectedObject,
      confidence,
      harmful,
      siren: harmful,
      allDetections: zoneDetections
    });

  } catch (error) {
    console.log("Backend Error:", error.message);
    res.status(500).json({ error: "Detection failed" });
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