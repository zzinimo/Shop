const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 10,
    },
    password: {
      type: String,
      select: false,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 10,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Please proved a valid email address",
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
