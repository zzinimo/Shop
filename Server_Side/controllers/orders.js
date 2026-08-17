const mongoose = require("mongoose");
const Order = require("../models/orders");
const jwt = require("jsonwebtoken");

const allowedStatusNames = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

const guestTokenSecretKey =
  process.env.GUEST_ORDER_SECRET || process.env.JWT_SECRET;

// Create
module.exports.createOrder = async (req, res, next) => {
  const user = req.user;

  if (req.user) {
    try {
      const { customer, shippingAddress, items } = req.body;

      if (!customer || !shippingAddress) {
        return res.status(400).json({
          message: "customer and shippingAddress are required",
        });
      }

      // if (!Array.isArray(items) || items.length === 0) {
      //   return res.status(400).json({
      //     message: "at least one item is required",
      //   });
      // }

      const subtotal = items.reduce((sum, item) => {
        const qty = Number(item.quantity);
        const price = Number(item.price);

        // if (
        //   !Number.isFinite(qty) ||
        //   qty <= 0 ||
        //   !Number.isFinite(price) ||
        //   price <= 0
        // ) {
        //   throw new Error("INVALID_ITEM");
        // }

        return sum + qty * price;
      }, 0);

      const shipping = 0;
      const total = subtotal + shipping;

      const newOrder = await Order.create({
        userId: new mongoose.Types.ObjectId(req.user.id),
        customer,
        shippingAddress,
        items,
        totals: {
          subtotal,
          shipping,
          total,
        },
        status: "pending",
      });

      return res.status(201).json({
        message: "Order created",
        order: newOrder,
      });
    } catch (err) {
      if (err.message === "INVALID_ITEM") {
        return res.status(400).json({
          message:
            "quantity must be greater than 0 and price must be greater than 0",
        });
      }

      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Invalid order data",
          errors: err.errors,
        });
      }

      console.error("Error creating order:", err);
      return next(err);
    }
  } else {
    //GUEST ORDER LOGIC
    // ----------------------------------------------------------------------
    try {
      const { guestEmail, items, shippingAddress } = req.body;

      if (!guestEmail || !items || !Array.isArray(items) || !shippingAddress) {
        return res.status(400).json({
          message:
            "Email is required, shipping address is required and at least one item in cart.",
        });
      }
      const subtotal = items.reduce((sum, item) => {
        const qty = Number(item.quantity);
        const price = Number(item.price);

        if (
          !Number.isFinite(qty) ||
          qty <= 0 ||
          !Number.isFinite(price) ||
          price <= 0
        ) {
          throw new Error("INVALID_ITEM");
        }
        return sum + qty * price;
      }, 0);

      const shipping = 0;
      const total = subtotal + shipping;

      const newGuestOrder = await Order.create({
        guestEmail: guestEmail,
        shippingAddress,
        items: items,
        totals: {
          subtotal: subtotal,
          shipping,
          total,
        },
      });

      const token = await jwt.sign(
        {
          orderId: newGuestOrder._id,
          email: guestEmail,
        },
        guestTokenSecretKey,

        { expiresIn: "10m" },
      );

      res.cookie("guestOrder", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 600000,
      });

      return res.status(200).json({ message: "Guest order submitted" });
    } catch (err) {
      console.error("order creating guest order :", err);
      return next(err);
    }
  }
};

// Read
module.exports.getOrder = async (req, res, next) => {
  try {
    const { status } = req.query;
    const user = req.currentUser;

    if (!status) {
      const orders = await Order.find({ userId: user._id }).sort({
        createdAt: -1,
      });
      return res.status(200).json({ orders });
    }

    if (!allowedStatusNames.includes(status)) {
      return res.status(400).json({ message: "Invalid status query" });
    }

    const filteredOrders = await Order.find({ userId: user._id, status }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ orders: filteredOrders });
  } catch (err) {
    next(err);
  }
};

module.exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.currentUser;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json({ order });
  } catch (err) {
    return next(err);
  }
};

// Update
module.exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = req.currentUser;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    if (!allowedStatusNames.includes(status)) {
      return res.status(400).json({
        message:
          "invalid status value. Must be either pending, paid, shipped, delivered, cancelled",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (updatedOrder.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    return res.status(200).json({
      message: "Order status updated",
      order: updatedOrder,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid status",
        errors: err.errors,
      });
    }

    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid order id" });
    }

    return next(err);
  }
};

module.exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.currentUser;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    if (order.status === "pending" || order.status === "paid") {
      order.status = "cancelled";
      await order.save();
      return res.status(200).json({
        message: "Order cancelled",
        order,
      });
    }

    return res.status(409).json({
      message: `Order cannot be cancelled from status ${order.status}`,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid order id" });
    }

    return next(err);
  }
};

// Delete
module.exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.currentUser;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (deletedOrder.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this order" });
    }

    return res.status(200).json({
      message: "Order deleted",
      order: deletedOrder,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid order id" });
    }

    return next(err);
  }
};
