require("dotenv").config();


const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");



const Log = require("./models/Log");
const Crop = require("./models/Crop");
const User = require("./models/User");
const Settings = require("./models/Settings");
const authMiddleware =
  require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
/* =========================================================
   MONGODB CONNECTION
   ========================================================= */

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/crop-protection"
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  });

/* =========================================================
   UPLOAD
   ========================================================= */

const upload = multer({
  dest: "uploads/"
});

/* =========================================================
   CROP RULES
   ========================================================= */

let rulesCache = {};

async function loadRules() {
  try {
    const crops = await Crop.find();

    rulesCache = {};

    crops.forEach((crop) => {
      rulesCache[crop.name.toLowerCase()] =
        (crop.harmful || []).map((item) =>
          item.toLowerCase()
        );
    });

    console.log(
      "Crop rules loaded:",
      Object.keys(rulesCache)
    );

  } catch (error) {
    console.error(
      "Failed to load crop rules:",
      error.message
    );
  }
}

loadRules();

setInterval(
  loadRules,
  30000
);

/* =========================================================
   SYSTEM SETTINGS
   ========================================================= */

const DEFAULT_SETTINGS = {
  monitoring: true,
  autoSiren: true,
  emailAlerts: true,
  confidence: 50,
  threatDuration: 10
};

let settings = {
  ...DEFAULT_SETTINGS
};

/* =========================================================
   LOAD SETTINGS FROM MONGODB
   ========================================================= */

async function loadSettings() {
  try {

    let savedSettings =
      await Settings.findOne();

    if (!savedSettings) {

      savedSettings =
        await Settings.create(
          DEFAULT_SETTINGS
        );

      console.log(
        "Default settings created in MongoDB"
      );
    }

    settings = {
      monitoring:
        savedSettings.monitoring,

      autoSiren:
        savedSettings.autoSiren,

      emailAlerts:
        savedSettings.emailAlerts,

      confidence:
        savedSettings.confidence,

      threatDuration:
        savedSettings.threatDuration
    };

    console.log(
      "Settings loaded:",
      settings
    );

  } catch (error) {

    console.error(
      "Failed to load settings:",
      error.message
    );
  }
}

loadSettings();

/* =========================================================
   TRACKING
   ========================================================= */

const activeTracks =
  new Map();

const TRACK_TIMEOUT_MS = 5000;

/* =========================================================
   EMAIL
   ========================================================= */

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user:
        process.env.GMAIL_USER,

      pass:
        process.env.GMAIL_APP_PASSWORD
    }
  });

let lastEmailSent = 0;

const EMAIL_COOLDOWN_MS =
  60000;

async function sendAlertEmail(
  objectLabel,
  crop,
  threatLevel,
  imagePath
) {

  const now =
    Date.now();

  if (
    now - lastEmailSent <
    EMAIL_COOLDOWN_MS
  ) {

    console.log(
      "Email skipped (cooldown active)."
    );

    return;
  }

  lastEmailSent = now;

  const detectedTime =
    new Date().toLocaleString();

  try {

    const info =
      await transporter.sendMail({

        from:
          process.env.GMAIL_USER,

        to:
          process.env.OWNER_EMAIL,

        subject:
          `Crop Alert: ${objectLabel} detected (${threatLevel})`,

        text:
          `A ${objectLabel} was detected in your ${crop} field.\n` +
          `Threat level: ${threatLevel}\n` +
          `Time: ${detectedTime}`,

        attachments:
          imagePath
            ? [
                {
                  filename:
                    "detection.jpg",

                  path:
                    imagePath
                }
              ]
            : []
      });

    console.log(
      "Alert email sent."
    );

    console.log(
      "accepted:",
      info.accepted
    );

    console.log(
      "rejected:",
      info.rejected
    );

    console.log(
      "response:",
      info.response
    );

    console.log(
      "messageId:",
      info.messageId
    );

  } catch (error) {

    console.log(
      "Email send failed:",
      error.message
    );
  }
}

/* =========================================================
   SETTINGS API - GET
   ========================================================= */

app.get(
  "/api/settings",
  authMiddleware,
  async (req, res) => {

    try {

      const savedSettings =
        await Settings.findOne();

      if (!savedSettings) {

        return res.json(
          DEFAULT_SETTINGS
        );
      }

      const currentSettings = {
        monitoring:
          savedSettings.monitoring,

        autoSiren:
          savedSettings.autoSiren,

        emailAlerts:
          savedSettings.emailAlerts,

        confidence:
          savedSettings.confidence,

        threatDuration:
          savedSettings.threatDuration
      };

      settings =
        currentSettings;

      res.json(
        currentSettings
      );

    } catch (error) {

      console.error(
        "Settings fetch error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to fetch settings"
      });
    }
  }
);

/* =========================================================
   SETTINGS API - PUT
   ========================================================= */

app.put(
  "/api/settings",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        monitoring,
        autoSiren,
        emailAlerts,
        confidence,
        threatDuration
      } = req.body;

      const updateData = {};

      /* MONITORING */

      if (
        typeof monitoring === "boolean"
      ) {
        updateData.monitoring = monitoring;
      }

      /* SIREN */

      if (
        typeof autoSiren === "boolean"
      ) {
        updateData.autoSiren = autoSiren;
      }

      /* EMAIL */

      if (
        typeof emailAlerts === "boolean"
      ) {
        updateData.emailAlerts = emailAlerts;
      }

      /* CONFIDENCE */

      if (
        typeof confidence === "number" &&
        confidence >= 1 &&
        confidence <= 100
      ) {
        updateData.confidence = confidence;
      }

      /* HIGH THREAT DURATION */

      if (
        typeof threatDuration === "number" &&
        threatDuration >= 1 &&
        threatDuration <= 60
      ) {
        updateData.threatDuration =
          threatDuration;
      }

      /* SAVE TO MONGODB */

      const savedSettings =
        await Settings.findOneAndUpdate(
          {},
          updateData,
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
          }
        );

      /* UPDATE MEMORY */

      settings = {
        monitoring:
          savedSettings.monitoring,

        autoSiren:
          savedSettings.autoSiren,

        emailAlerts:
          savedSettings.emailAlerts,

        confidence:
          savedSettings.confidence,

        threatDuration:
          savedSettings.threatDuration
      };

      console.log(
        "Settings saved to MongoDB:",
        settings
      );

      res.json({
        message:
          "Settings saved successfully",

        settings:
          settings
      });

    } catch (error) {

      console.error(
        "Settings save error:",
        error.message
      );

      res.status(500).json({
        error:
          "Failed to save settings"
      });
    }
  }
);

/* =========================================================
   AI ANALYZE
   ========================================================= */
   
 
app.post(
  "/api/analyze",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {

    let detectedObject = "none";
    let confidence = 0;
    let harmful = false;
    let threatLevel = "SAFE";

    try {

      /* -----------------------------------------------
         SYSTEM MONITORING OFF
         ----------------------------------------------- */

      if (!settings.monitoring) {

        return res.json({

          detectedObject: "none",

          confidence: 0,

          harmful: false,

          threatLevel: "SAFE",

          // Siren must be OFF when monitoring is OFF
          siren: false,

          allDetections: [],

          imageWidth: 640,

          imageHeight: 480,

          monitoring: false
        });
      }

      const crop = (
        req.body.crop || "wheat"
      ).toLowerCase();

      const zone = req.body.zone
        ? JSON.parse(req.body.zone)
        : null;

      const now = Date.now();

      /* -----------------------------------------------
         SEND IMAGE TO AI SERVICE
         ----------------------------------------------- */

      const formData = new FormData();

      formData.append(
        "file",
        fs.createReadStream(req.file.path)
      );

      const response = await axios.post(
        "http://127.0.0.1:8000/detect",
        formData,
        {
          headers: formData.getHeaders()
        }
      );

      const detections =
        response.data.detections || [];

      const imgW =
        response.data.imageWidth || 640;

      const imgH =
        response.data.imageHeight || 480;

      /* -----------------------------------------------
         CROP ZONE
         ----------------------------------------------- */

      const inZone = (d) => {

        if (!zone) {

          return true;
        }

        const cx =
          (
            (
              d.boundingBox.x1 +
              d.boundingBox.x2
            ) /
            2 /
            imgW
          ) * 100;

        const cy =
          (
            (
              d.boundingBox.y1 +
              d.boundingBox.y2
            ) /
            2 /
            imgH
          ) * 100;

        return (

          cx >= zone.left &&

          cx <=
            zone.left +
            zone.width &&

          cy >= zone.top &&

          cy <=
            zone.top +
            zone.height
        );
      };

      const zoneDetections =
        detections.filter(
          inZone
        );

      /* -----------------------------------------------
         TRACK CLEANUP
         ----------------------------------------------- */

      for (
        const [
          id,
          track
        ] of activeTracks.entries()
      ) {

        if (
          now -
            track.lastSeen >
          TRACK_TIMEOUT_MS
        ) {

          activeTracks.delete(
            id
          );
        }
      }

      /* -----------------------------------------------
         TRACK NEW SIGHTINGS
         ----------------------------------------------- */

      const newSightings =
        [];

      for (
        const d of zoneDetections
      ) {

        if (
          d.trackId !== null &&
          d.trackId !== undefined
        ) {

          const isIntruderNow =
            d.label ===
            "person"

              ? d.isOwner === false

              : rulesCache[
                  crop
                ]?.includes(
                  d.label.toLowerCase()
                ) || false;

          if (
            !activeTracks.has(
              d.trackId
            )
          ) {

            newSightings.push(
              d
            );

            activeTracks.set(
              d.trackId,

              {
                firstSeen:
                  now,

                lastSeen:
                  now,

                wasHarmful:
                  isIntruderNow
              }
            );

          } else {

            const track =
              activeTracks.get(
                d.trackId
              );

            if (
              isIntruderNow &&
              !track.wasHarmful
            ) {

              newSightings.push(
                d
              );
            }

            track.lastSeen =
              now;

            track.wasHarmful =
              isIntruderNow;
          }
        }
      }

      /* -----------------------------------------------
         DETERMINE THREAT
         ----------------------------------------------- */

      if (
        zoneDetections.length >
        0
      ) {

        const harmfulDetection =
          zoneDetections.find(
            (d) => {

              if (
                d.label ===
                "person"
              ) {

                return (
                  d.isOwner ===
                  false
                );
              }

              return (
                rulesCache[
                  crop
                ]?.includes(
                  d.label.toLowerCase()
                ) || false
              );
            }
          );

        if (
          harmfulDetection
        ) {

          detectedObject =
  harmfulDetection.label === "person"
    ? (
        harmfulDetection.isOwner === true
          ? "OWNER"
          : "STRANGER"
      )
    : harmfulDetection.label;

          confidence =
            harmfulDetection.confidence;

          harmful =
            true;

          const track =
            activeTracks.get(
              harmfulDetection.trackId
            );

          const dwellSeconds =
            track
              ? (
                  now -
                  track.firstSeen
                ) / 1000
              : 0;

          threatLevel =
            dwellSeconds >=
            settings.threatDuration
              ? "HIGH"
              : "WARNING";

        } else {

          const topDetection =
            zoneDetections.reduce(
              (a, b) =>
                a.confidence >
                b.confidence
                  ? a
                  : b
            );
              

            detectedObject =
  topDetection.label === "person"
    ? (
        topDetection.isOwner === true
          ? "OWNER"
          : "STRANGER"
      )
    : topDetection.label;

          confidence =
            topDetection.confidence;

          harmful =
            false;
        }
      }

      /* -----------------------------------------------
         CONSOLE LOG
         ----------------------------------------------- */

      const personDetections =
        zoneDetections.filter(
          (d) =>
            d.label ===
            "person"
        );

      console.log({

        crop,

        detectedObject,

        confidence,

        harmful,

        threatLevel,

        totalDetections:
          zoneDetections.length,

        persons:
          personDetections.map(
            (p) => ({

              isOwner:
                p.isOwner,

              faceConfidence:
                p.faceConfidence

            })
          )

      });

      /* -----------------------------------------------
         SAVE NEW SIGHTINGS
         ----------------------------------------------- */

      for (
        const sighting of
          newSightings
      ) {

        const isIntruder =
          sighting.label ===
          "person"

            ? sighting.isOwner ===
              false

            : rulesCache[
                crop
              ]?.includes(
                sighting.label.toLowerCase()
              ) || false;

        await Log.create({

          object:
  sighting.label === "person"
    ? (
        sighting.isOwner === true
          ? "OWNER"
          : "STRANGER"
      )
    : sighting.label,

          crop,

          harmful:
            isIntruder,

          confidence:
            sighting.confidence,

          trackId:
            sighting.trackId,

          boundingBox:
            sighting.boundingBox,

          insideCropZone:
            true,

          threatLevel:
            isIntruder
              ? "WARNING"
              : "SAFE",

          sirenActivated:
            isIntruder &&
            settings.autoSiren

        });

        /* ---------------------------------------------
           EMAIL
           --------------------------------------------- */

        if (
          isIntruder &&
          settings.emailAlerts
        ) {

         const alertObject =
  sighting.label === "person"
    ? (
        sighting.isOwner === true
          ? "OWNER"
          : "STRANGER"
      )
    : sighting.label;

console.log(
  "Triggering email for:",
  alertObject
);

await sendAlertEmail(

  alertObject,

  crop,

  "WARNING",

  req.file.path

          );
        }
      }

      /* -----------------------------------------------
         ANNOTATED DETECTIONS
         ----------------------------------------------- */

 const annotatedDetections =
  zoneDetections.map(
    (d) => ({

      ...d,

      displayLabel:
        d.label === "person"
          ? (
              d.isOwner === true
                ? "OWNER"
                : "STRANGER"
            )
          : d.label,

      isHarmful:

        d.label ===
        "person"

          ? d.isOwner ===
            false

          : rulesCache[
              crop
            ]?.includes(
              d.label.toLowerCase()
            ) || false

    })
  );

      /* -----------------------------------------------
         RESPONSE
         ----------------------------------------------- */

      res.json({

        detectedObject,

        confidence,

        harmful,

        threatLevel,

        siren:
          harmful &&
          settings.autoSiren,

        allDetections:
          annotatedDetections,

        imageWidth:
          imgW,

        imageHeight:
          imgH,

        monitoring:
          settings.monitoring
      });

    } catch (error) {

      console.log(
        "Backend Error:",
        error.message
      );

      res.status(500).json({

        error:
          "Detection failed"

      });

    } finally {

      if (req.file) {

        fs.unlink(
          req.file.path,
          () => {}
        );
      }
    }
  }
);

/* =========================================================
   LOGS
   ========================================================= */

app.get(
  "/api/logs",
  authMiddleware,
  async (req, res) => {
    try {
      const logs = await Log.find()
        .sort({ time: -1 })
        .limit(100);

      res.json(logs);

    } catch (error) {

      res.status(500).json({
        error: "Failed to fetch logs",
      });

    }
  }
);

/* =========================================================
   DETAILED ANALYTICS
   ========================================================= */

app.get(
  "/api/analytics/detailed",

  async (req, res) => {

    try {

      const byObject =
        await Log.aggregate([

          {
            $match: {
              harmful: true
            }
          },

          {
            $group: {

              _id:
                "$object",

              count: {
                $sum: 1
              }

            }
          },

          {
            $sort: {
              count: -1
            }
          }

        ]);

      const sevenDaysAgo =
        new Date();

      sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() -
          6
      );

      sevenDaysAgo.setHours(
        0,
        0,
        0,
        0
      );

      const byDay =
        await Log.aggregate([

          {
            $match: {

              time: {
                $gte:
                  sevenDaysAgo
              }

            }
          },

          {
            $group: {

              _id: {
                $dateToString: {

                  format:
                    "%Y-%m-%d",

                  date:
                    "$time"

                }
              },

              count: {
                $sum: 1
              }

            }
          },

          {
            $sort: {
              _id: 1
            }
          }

        ]);

      res.json({

        byObject,

        byDay

      });

    } catch (error) {

      res.status(500).json({

        error:
          "Failed to fetch detailed analytics"

      });
    }
  }
);

/* =========================================================
   ANALYTICS
   ========================================================= */

app.get(
  "/api/analytics",

  async (req, res) => {

    try {

      const total =
        await Log.countDocuments();

      const harmful =
        await Log.countDocuments({

          harmful:
            true

        });

      const safe =
        total -
        harmful;

      res.json({

        total,

        harmful,

        safe

      });

    } catch (error) {

      res.status(500).json({

        error:
          "Failed to fetch analytics"

      });
    }
  }
);

/* =========================================================
   CROP RULES API
   ========================================================= */

app.get(
  "/api/crops",

  async (req, res) => {

    try {

      const crops =
        await Crop.find()
          .sort({
            name: 1
          });

      res.json(
        crops
      );

    } catch (error) {

      console.error(

        "Crop rules fetch error:",

        error.message

      );

      res.status(500).json({

        error:
          "Failed to fetch crop rules"

      });
    }
  }
);

// =========================================================
// AUTHENTICATION - REGISTER
// =========================================================

const bcrypt = require("bcryptjs");

app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      location,
      faceScanned,
    } = req.body;

    // Validate required fields

    if (
      !name ||
      !email ||
      !password ||
      !location
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // Check email

    const existingUser =
      await User.findOne({
        email: email.toLowerCase().trim(),
      });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    // Password validation

    if (password.length < 6) {
      return res.status(400).json({
        error:
          "Password must be at least 6 characters",
      });
    }

    // Hash password

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user

    const user = await User.create({
      name: name.trim(),

      email: email
        .toLowerCase()
        .trim(),

      password: hashedPassword,

      location: location.trim(),

      faceScanned:
        faceScanned === true,
    });

    console.log(
      "New owner registered:",
      user.email
    );

    res.status(201).json({
      message:
        "Owner registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        faceScanned: user.faceScanned,
      },
    });

  } catch (error) {

    console.error(
      "Registration error:",
      error.message
    );

    res.status(500).json({
      error:
        "Registration failed",
    });
  }
});

// =========================================================
// AUTHENTICATION - LOGIN
// =========================================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request received:", email);

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      console.log("Login failed: user not found");

      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      console.log("Login failed: incorrect password");

      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log(
      "User logged in:",
      user.email
    );

    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        faceScanned: user.faceScanned,
      },
    });

  } catch (error) {
    console.error(
      "Login error:",
      error.message
    );

    res.status(500).json({
      error: "Login failed",
    });
  }
});

/* =========================================================
   SERVER
   ========================================================= */

app.listen(
  5000,

  () => {

    console.log(
      "Backend running on port 5000"
    );

  }
);