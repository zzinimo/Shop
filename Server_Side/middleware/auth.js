const jwt = require("jsonwebtoken");
const User = require("../models/users");
const secretKey = "MY_SECRET_KEY";

module.exports.checkToken = async (req, res, next) => {
  try {
    const token = req.cookies.user;

    if (!token) {
      return res.status(401).json({ message: "please log in" });
    }

    const user = jwt.verify(token, secretKey);

    req.user = user;

    return next();
  } catch (err) {
    if (err.name === "JsonWebToekenError") {
      return res.status(401).json({ error: "JsonWebTokenError" });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "TokenExpiredError" });
    }

    return next(err);
  }
};

module.exports.getUserFromDb = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: "User not found in database" });
    }

    req.currentUser = user;

    return next();
  } catch (err) {
    return next(err);
  }
};
