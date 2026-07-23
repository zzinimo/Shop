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
    res.status(401).json({ err: "Error checking token" });
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
    res.status(500).json({ err: "Internal database error" });
  }
};
