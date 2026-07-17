const clothingItem = require("../models/clothingItems");

module.exports.getClothingItems = async (req, res, next) => {
  try {
    const dataBaseItems = await clothingItem.find({});
    return res.status(200).json({ items: dataBaseItems });
  } catch (e) {
    console.error("Error getting clothing items:", e);
    return res.status(500).json({ message: "Error getting clothing items" });
  }
};
