const mongoose = require("mongoose");
const app = require("./app");

const { PORT = 3000, MONGODB_URI = "mongodb://localhost:27017/ECOMMERCE" } =
  process.env;

async function connectDB() {
  await mongoose.connect(MONGODB_URI);
  console.log("Successfully connected!");
}

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
