const mongoose = require("mongoose");
const Crop = require("./models/Crop");

async function updateRules() {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/crop-protection"
    );

    console.log("MongoDB connected");

    const rules = [
      {
        name: "wheat",
        harmful: [
          "cow",
          "goat",
          "monkey",
          "pig",
          "elephant",
          "bird"
        ],
        harmless: [
          "dog"
        ]
      },

      {
        name: "rice",
        harmful: [
          "cow",
          "goat",
          "monkey",
          "pig",
          "elephant",
          "bird"
        ],
        harmless: [
          "dog"
        ]
      },

      {
        name: "sugarcane",
        harmful: [
          "cow",
          "goat",
          "monkey",
          "pig",
          "elephant"
        ],
        harmless: [
          "dog",
          "bird"
        ]
      },

      {
        name: "maize",
        harmful: [
          "cow",
          "goat",
          "monkey",
          "pig",
          "elephant",
          "bird"
        ],
        harmless: [
          "dog"
        ]
      },

      {
        name: "tomato",
        harmful: [
          "cow",
          "goat",
          "monkey",
          "pig",
          "bird"
        ],
        harmless: [
          "dog"
        ]
      }
    ];

    // Remove old corn entry because dashboard uses "maize"
    await Crop.deleteOne({ name: "corn" });

    // Update/create each crop
    for (const rule of rules) {
      await Crop.findOneAndUpdate(
        { name: rule.name },
        rule,
        {
          upsert: true,
          new: true
        }
      );

      console.log(`Updated: ${rule.name}`);
    }

    console.log("\nCrop rules updated successfully!");

  } catch (error) {
    console.error(
      "Failed to update crop rules:",
      error.message
    );
  } finally {
    await mongoose.disconnect();
  }
}

updateRules();