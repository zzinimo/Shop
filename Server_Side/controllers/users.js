const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/users");

//move on process.env later
const secretKey = "MY_SECRET_KEY";

module.exports.createUser = async (req, res) => {
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
    res.status(500).json({ error: "Error creating user" });
  }
};

module.exports.login = async (req, res) => {
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
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secretKey, {
      expiresIn: "1h",
    });

    res.cookie("user", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (err) {
    console.error(err);

    if (err.name === "JsonWebToekenError") {
      return res.status(401).json({ error: "JsonWebTokenError" });
    }

    if (err.name === "TokenExpiredError") {
      res.status(401).json({ error: "TokenExpiredError" });
    }

    return res.status(500).json({ message: "Invalid credentials" });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie("user", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });

    return res.status(200).json({ message: "Logging out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Logout failed" });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.user;

    if (!token) {
      res.status(401).json({ message: "please log in" });
    }

    const decodedToken = await jwt.verify(token, secretKey);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      res.status(401).json({ error: "Token is not valid" });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    console.error(err);
  }
};
