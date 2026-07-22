const mongoose = require("mongoose");
const Order = require("../models/orders");

const allowedStatusNames = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

//Create
module.exports.createOrder = async (req, res, next) => {
  try {
    const { customer, shippingAddress, items } = req.body;

<<<<<<< Updated upstream
    if (
      !customer ||
      !shippingAddress ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
=======
    if (!customer || !shippingAddress) {
>>>>>>> Stashed changes
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
    return res.status(500).json({ message: "Error creating order" });
  }
};

<<<<<<< Updated upstream
//Read
module.exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: "Invalid ID format provided" });
    }

    const order = await Order.findById(orderId);
=======
module.exports.getOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Error getting orders:", err);
    return res.status(500).json({ message: "Error getting orders" });
  }
};

module.exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
>>>>>>> Stashed changes

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

<<<<<<< Updated upstream
    return res.status(200).json({ order: order });
  } catch (err) {
    console.error("Error from getOrder: ", err);
    return res.status(500).json({ message: err.message });
  }
};

//Read
module.exports.getOrder = async (req, res) => {
  try {
    const status = req.query.status;
    if (!status) {
      const orders = await Order.find({});
      return res.status(200).json({ orders: orders });
    }

    if (!allowedStatusNames.includes(status)) {
      return res.status(400).json({ message: "Invalid status query " });
    }
    const filteredOrders = await Order.find({ status: status });

    return res.status(200).json({ orders: filteredOrders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Update
module.exports.updateStatus = async (req, res) => {
  try {
    const orderId = req.params.id;

    const newStatus = req.body.status;

    if (!mongoose.isValidObjectId(orderId)) {
      return res
        .status(400)
        .json({ message: "cannot update status. Invalid Object ID" });
    }

    if (!allowedStatusNames.includes(newStatus)) {
      return res.status(400).json({
        message:
          "invalid status value. Must be either pending, paid, shipped, delivered, cancelled ",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: orderId },
      {
        $set: {
          status: newStatus,
        },
      },
      { new: true, runValidators: true },
=======
    return res.status(200).json({ order });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid order id" });
    }

    console.error("Error getting order by id:", err);
    return res.status(500).json({ message: "Error getting order" });
  }
};

module.exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      },
>>>>>>> Stashed changes
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

<<<<<<< Updated upstream
    return res.status(200).json({ order: updatedOrder });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Update
module.exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!mongoose.isValidObjectId(orderId)) {
      return res
        .status(400)
        .json({ message: "Cannot cancel. Invalid Object ID" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    if (order.status === "pending" || order.status === "paid") {
      order.status = "cancelled";
      await order.save();
      return res.status(200).json({
        message: "Order has been cancelled",
        order: order,
      });
    }

    return res.status(409).json({
      message: `Order cannot be cancelled because status is cancelled/shipped/delivered. Current status is ${order.status.toUpperCase()}`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Delete
module.exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!mongoose.isValidObjectId(orderId)) {
      return res
        .status(400)
        .json({ message: "Cannot cancel. Invalid Object ID" });
    }
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Successfully deleted", deletedOrder: deletedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
=======
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

    console.error("Error updating order status:", err);
    return res.status(500).json({ message: "Error updating order status" });
  }
};

module.exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cancelledOrder = await Order.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true },
    );

    if (!cancelledOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order cancelled",
      order: cancelledOrder,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid order id" });
    }

    console.error("Error cancelling order:", err);
    return res.status(500).json({ message: "Error cancelling order" });
  }
};

module.exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
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

    console.error("Error deleting order:", err);
    return res.status(500).json({ message: "Error deleting order" });
>>>>>>> Stashed changes
  }
};
