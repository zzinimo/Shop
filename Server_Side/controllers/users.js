const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const checkToken = require("../middleware/auth.js");

const User = require("../models/users");

const secretKey = process.env.JWT_SECRET;

module.exports.createUser = async (req, res, next) => {
  const saltRounds = 10;

  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ error: "Email, password, and username are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userToCreate = {
      username,
      email,
      password: hashedPassword,
    };
    const user = await User.create(userToCreate);
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(401)
      .json({ message: "Must provide email, username and password" });
  }

  try {
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });

    res.cookie("user", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("user", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000,
    });

    return res.status(200).json({ message: "Logging out" });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = req.currentUser;

    if (!currentUser) {
      res.status(401).json({ message: "Current user not found" });
    }

    res.status(200).json({
      id: currentUser._id,
      email: currentUser.email,
      username: currentUser.username,
    });
  } catch (err) {
    return next(err);
  }
};
