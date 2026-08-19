const mongoose = require("mongoose");
const Crop = require("./models/Crop");

mongoose.connect("mongodb://127.0.0.1:27017/crop-protection").then(async () => {
  const crops = [
    { name: "rice", harmful: ["cow", "monkey", "bird"], harmless: ["dog", "goat"] },
    { name: "wheat", harmful: ["cow", "monkey", "pig"], harmless: ["dog", "goat"] },
    { name: "corn", harmful: ["bird", "monkey", "pig"], harmless: ["dog", "goat"] },
    { name: "tomato", harmful: ["monkey", "bird", "pig"], harmless: ["dog", "goat"] }
  ];

  for (const c of crops) {
    await Crop.findOneAndUpdate({ name: c.name }, c, { upsert: true });
  }

  console.log("Crops seeded.");
  process.exit(0);
});