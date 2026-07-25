const mongoose = require("mongoose");
const validator = require("validator");

const orderSchema = new mongoose.Schema(
  {
    guestEmail: {
      type: String,
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "please provide a valid email address",
      },
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    customer: {
      firstName: {
        type: String,
        required: false,
        trim: true,
      },

      lastName: {
        type: String,
        required: false,
        trim: true,
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
          message: "Please provide a valid email address",
        },
      },
    },

    shippingAddress: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    items: [
      {
        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "ClothingItems",
        },
        src: {
          type: String,
          required: true,
          trim: true,
        },

        description: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    totals: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      shipping: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
