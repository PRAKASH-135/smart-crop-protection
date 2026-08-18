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

const upload = multer({
  dest: "uploads/"
});

// crop rules
const rules = {
  rice: ["cow", "dog"],
  corn: ["bird"],
  wheat: ["cow", "monkey"]
};

app.post(
  "/api/analyze",
  upload.single("image"),
  async (req, res) => {

    try {

      const crop = req.body.crop;

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

      const detections = response.data.detections || [];

      let detectedObject = "none";
      let confidence = 0;
      let harmful = false;

      if (detections.length > 0) {
        const harmfulDetection = detections.find((d) =>
          rules[crop]?.includes(d.label.toLowerCase())
        );

        if (harmfulDetection) {
          detectedObject = harmfulDetection.label;
          confidence = harmfulDetection.confidence;
          harmful = true;
        } else {
          const topDetection = detections.reduce((a, b) =>
            a.confidence > b.confidence ? a : b
          );
          detectedObject = topDetection.label;
          confidence = topDetection.confidence;
          harmful = false;
        }
      }

      console.log({
        crop,
        detectedObject,
        harmful,
        totalDetections: detections.length
      });

      await Log.create({
        object: detectedObject,
        crop,
        harmful,
        confidence
      });

      res.json({
        detectedObject,
        confidence,
        harmful,
        siren: harmful,
        allDetections: detections
      });

    } catch (error) {

      console.log(
        "Backend Error:",
        error.message
      );

      res.status(500).json({
        error: "Detection failed"
      });

    }

  }
);

app.get("/api/logs", async (req, res) => {

  const logs =
    await Log.find()
      .sort({ time: -1 });

  res.json(logs);

});

app.get("/api/analytics", async (req, res) => {

  const total =
    await Log.countDocuments();

  const harmful =
    await Log.countDocuments({
      harmful: true
    });

  const safe =
    await Log.countDocuments({
      harmful: false
    });

  res.json({
    total,
    harmful,
    safe
  });

});

app.listen(5000, () => {
  console.log(
    "Backend running on port 5000"
  );
});