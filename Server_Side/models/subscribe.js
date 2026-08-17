const mongoose = require("mongoose");
const validator = require("validator");

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Please enter valid email",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Subscriber", subscriberSchema);
