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

app.set("trust proxy", 1);

const normalizeOrigin = (value) => value.replace(/^['"]|['"]$/g, "").trim();

const allowedOrigins = new Set(
  [FRONTEND_URL, process.env.FRONTEND_URLS || ""]
    .join(",")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map(normalizeOrigin),
);

async function connectDB() {
  await mongoose.connect(MONGODB_URI);
  console.log("Successfully connected!");
}

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
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use("/clothing-items", clothingRouter);
app.use("/login", userRouter);
app.use("/orders", ordersRouter);
app.use("/subscribe", subscribersRouter);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`App listening to port ${PORT}`);
    });
  } catch (err) {
    console.error(
      "Unable to start server because the database connection failed",
      err,
    );
    process.exitCode = 1;
  }
}

startServer();
