const router = require("express").Router();
const { get } = require("mongoose");
const { getClothingItems } = require("../controllers/clothingItems");

router.get("/", getClothingItems);

module.exports = router;
