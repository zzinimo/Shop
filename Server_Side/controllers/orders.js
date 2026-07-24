const mongoose = require("mongoose");
const Order = require("../models/orders");

const allowedStatusNames = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

// Create
module.exports.createOrder = async (req, res, next) => {
  try {
    const { customer, shippingAddress, items } = req.body;

    if (!customer || !shippingAddress) {
      return res.status(400).json({
        message: "customer and shippingAddress are required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "at least one item is required",
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

    const newOrder = await Order.create({
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
};

// Read
module.exports.getOrder = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (!status) {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ orders });
    }

    if (!allowedStatusNames.includes(status)) {
      return res.status(400).json({ message: "Invalid status query" });
    }

    const filteredOrders = await Order.find({ status }).sort({ createdAt: -1 });
    return res.status(200).json({ orders: filteredOrders });
  } catch (err) {
    next(err);
  }
};

module.exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
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
