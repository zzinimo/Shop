const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User } = require("../models/users");

//move on process.env later
const secretKey = "MY_SECRET_KEY";

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
