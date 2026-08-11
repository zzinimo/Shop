const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const clothingRouter = require("./routes/clothingItemRouter");
const ordersRouter = require("./routes/ordersRouter");
const userRouter = require("./routes/userRouter");
const subscribersRouter = require("./routes/subscribersRouter");
const { errorHandler } = require("./middleware/errors");

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
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/clothing-items", clothingRouter);
app.use("/login", userRouter);
app.use("/orders", ordersRouter);
app.use("/subscribe", subscribersRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
});
