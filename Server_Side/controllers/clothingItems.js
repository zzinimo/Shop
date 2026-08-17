const clothingItem = require("../models/clothingItems");

module.exports.getClothingItems = async (req, res, next) => {
  try {
    const dataBaseItems = await clothingItem.find({});
    return res.status(200).json({ items: dataBaseItems });
  } catch (error) {
    return next(error);
  }
};
