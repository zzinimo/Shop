const jwt = require("jsonwebtoken");
const User = require("../models/users");
const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  throw new Error("JWT_SECRET is required");
}

module.exports.checkToken = async (req, res, next) => {
  //for endpoints that should only work for logged in users
  try {
    const token = req.cookies.user;

    if (!token) {
      return res.status(401).json({ message: "please log in" });
    }

    const user = jwt.verify(token, secretKey);

    req.user = user;

    return next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
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

// Must run after getUserFromDb. The role is read from the database, not the JWT,
// so demoting an admin takes effect immediately instead of when their token expires.
module.exports.requireAdmin = (req, res, next) => {
  if (req.currentUser?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  return next();
};

//for guest checkouts
module.exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.user;
    if (token) {
      const user = jwt.verify(token, secretKey);
      req.user = user;
    }

    return next();
  } catch (err) {
    return next();
  }
};
