const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/clothingItemRouter");

const { PORT = 3000 } = process.env;

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ECOMMERCE");
    console.log("Successfully connected!");
  } catch (err) {
    console.error(err);
  }
}

connectDB();
app.use(express.static("public"));
app.use(cors());
app.use("/clothing-items", router);

app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
});
