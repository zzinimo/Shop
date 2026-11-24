const mongoose = require("mongoose");
const Order = require("../models/orders");
const ClothingItem = require("../models/clothingItems");
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Creates an error the central errorHandler turns into a 400 response.
const badRequest = (message) => {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
};

// Prices are stored as strings like "$1,250.00", so strip formatting first.
const parsePrice = (value) =>
  Number(String(value).replace("$", "").replaceAll(",", ""));

// Never trust a price sent by the browser: anyone can edit the request in
// DevTools. Look every product up in the database and charge that price.
const priceItemsFromDb = async (items) => {
  const productIds = [...new Set(items.map((item) => String(item.productId)))];

  if (!productIds.every((id) => mongoose.isValidObjectId(id))) {
    throw badRequest("Invalid product id");
  }

  const products = await ClothingItem.find({ _id: { $in: productIds } });
  const priceById = new Map(
    products.map((product) => [
      product._id.toString(),
      parsePrice(product.price),
    ]),
  );

  return items.map((item) => {
    const price = priceById.get(String(item.productId));

    if (price === undefined) {
      throw badRequest(`Product ${item.productId} not found`);
    }

    if (!Number.isFinite(price) || price <= 0) {
      throw badRequest(`Product ${item.productId} is not available`);
    }

    return { ...item, price };
  });
};

const calculateTotals = (items) => {
  const subtotalInCents = items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0,
  );
  const subtotal = subtotalInCents / 100;
  const shipping = 0;
  return { subtotal, shipping, total: subtotal + shipping };
};

// Guest orders have no userId, so check it exists before comparing.
const isOrderOwner = (order, user) =>
  order.userId != null && order.userId.toString() === user._id.toString();

// Create
module.exports.createOrder = async (req, res, next) => {
  if (req.user) {
    try {
      const { customer, shippingAddress } = req.body;

      if (!customer || !shippingAddress) {
        return res.status(400).json({
          message: "customer and shippingAddress are required",
        });
      }

      const items = await priceItemsFromDb(req.body.items);

      const newOrder = await Order.create({
        userId: new mongoose.Types.ObjectId(req.user.id),
        customer,
        shippingAddress,
        items,
        totals: calculateTotals(items),
        status: "pending",
      });

      return res.status(201).json({
        message: "Order created",
        order: newOrder,
      });
    } catch (err) {
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
      const { guestEmail, shippingAddress } = req.body;

      if (
        !guestEmail ||
        !Array.isArray(req.body.items) ||
        req.body.items.length === 0 ||
        !shippingAddress
      ) {
        return res.status(400).json({
          message:
            "Email is required, shipping address is required and at least one item in cart.",
        });
      }

      const items = await priceItemsFromDb(req.body.items);

      const newGuestOrder = await Order.create({
        guestEmail,
        shippingAddress,
        items,
        totals: calculateTotals(items),
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

    if (!isOrderOwner(order, user)) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json({ order });
  } catch (err) {
    return next(err);
  }
};

// Update (admin only: the route runs requireAdmin first, so no owner check here)
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
    const user = req.currentUser;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!isOrderOwner(order, user)) {
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

    // Check ownership BEFORE deleting. Deleting first and checking after
    // would still return 403, but the order would already be gone.
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!isOrderOwner(order, user)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this order" });
    }

    await order.deleteOne();

    return res.status(200).json({
      message: "Order deleted",
      order,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid order id" });
    }

    return next(err);
  }
};
