const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
  src: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model(
  "ClothingItems",
  clothingItemSchema,
  "ClothingItems",
);
