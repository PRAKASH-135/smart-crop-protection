const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    monitoring: {
      type: Boolean,
      default: true
    },

    autoSiren: {
      type: Boolean,
      default: true
    },

    emailAlerts: {
      type: Boolean,
      default: true
    },

    confidence: {
      type: Number,
      default: 50
    },

    threatDuration: {
      type: Number,
      default: 10
    }
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.model("Settings", SettingsSchema);