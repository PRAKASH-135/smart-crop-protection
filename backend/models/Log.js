const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  object: String,
  crop: String,
  harmful: Boolean,
  confidence: Number,
  trackId: Number,
  boundingBox: {
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number
  },
  insideCropZone: Boolean,
  threatLevel: { type: String, default: "SAFE" },
  sirenActivated: Boolean,
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Log", LogSchema);