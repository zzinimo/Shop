const subscriber = require("../models/subscribe");

module.exports.getSubscriberEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const emailInDb = await subscriber.findOne({ email });

    if (emailInDb) {
      return res
        .status(400)
        .json({ error: true, message: "This email is already in use" });
    }

    const newSubscriber = await subscriber.create({ email });

    return res.status(200).json({ success: true, message: "email added" });
  } catch (e) {
    console.error("Error adding subscriber email", e);
    next(e);
  }
};
