const mongoose = require("mongoose");

const CropSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  harmful: [String],
  harmless: [String]
});

module.exports = mongoose.model("Crop", CropSchema);