const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({

  object: String,

  crop: String,

  harmful: Boolean,

  confidence: Number,

  time: {
    type: Date,
    default: Date.now
  }

});

module.exports =
  mongoose.model("Log", LogSchema);