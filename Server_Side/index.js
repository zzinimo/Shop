const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const clothingRouter = require("./routes/clothingItemRouter");
const ordersRouter = require("./routes/ordersRouter");
const loginRouter = require("./routes/loginRouter");

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
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/clothing-items", clothingRouter);
app.use("/login", loginRouter);
app.use("/orders", ordersRouter);

app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
});
