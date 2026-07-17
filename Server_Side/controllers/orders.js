const Order = require("../models/orders");

module.exports.createOrder = async (req, res, next) => {
  try {
    const { customer, shippingAddress, items } = req.body;

    if (!customer || !shippingAddress || !items) {
      return res.status(400).json({
        message:
          "customer, shippingAddress, and at least one item are required",
      });
    }

    const subtotal = items.reduce((sum, item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
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
