const mongoose = require("mongoose");

const readFiles = require("../fileRead");
const ClothingItems = require("../models/clothingItems");

const addToDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ECOMMERCE");
    const files = await readFiles(); //array
    const existingItemsInDb = await ClothingItems.find({}, "src"); //array of objects [{}]
    const existingSrcs = existingItemsInDb.map((item) => item.src); //array of src from DB

    //filtered out images that already are in the database
    const filteredFiles = files.filter((file) => {
      return !existingSrcs.includes(`/images/${file}`);
    });
    const newItems = filteredFiles.map((file) => {
      return {
        src: `/images/${file}`,
        price: 0,
        description: "",
      };
    });
    await ClothingItems.insertMany(newItems);
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
  }
};

addToDB();

// runFiles.js
