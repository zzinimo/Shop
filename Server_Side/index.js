const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const clothingRouter = require("./routes/clothingItemRouter");
const ordersRouter = require("./routes/ordersRouter");
const userRouter = require("./routes/userRouter");
const subscribersRouter = require("./routes/subscribersRouter");
const { errorHandler } = require("./middleware/errors");

const {
  PORT = 3000,
  MONGODB_URI = "mongodb://localhost:27017/ECOMMERCE",
  FRONTEND_URL = "http://localhost:5173",
  NODE_ENV = "development",
} = process.env;

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Successfully connected!");
  } catch (err) {
    console.error(err);
  }
}

connectDB();
app.use(express.static("public"));
app.use(cookieParser());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);
app.use(
  cors({
    origin: FRONTEND_URL,
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
