const Joi = require("joi");

const baseOrder = {
  shippingAddress: Joi.object({
    address: Joi.string().required().trim(),
  }).required(),
  items: Joi.array()
    .items(
      Joi.object({
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().min(0).required(),
        productId: Joi.string().required(),
        src: Joi.string().required().trim(),
        description: Joi.string().required().trim(),
      }),
    )
    .min(1)
    .required(),
  totals: Joi.object({
    subtotal: Joi.number().min(0),
    shipping: Joi.number().min(0),
    total: Joi.number().min(0),
  }),
  status: Joi.string().valid("pending").default("pending"),
};

const authOrderSchema = Joi.object({
  ...baseOrder,
  customer: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().lowercase().required().email().trim(),
  }).required(),
});

const guestOrderSchema = Joi.object({
  ...baseOrder,
  guestEmail: Joi.string().lowercase().email().required(),
});

const statusUpdateSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "paid", "shipped", "delivered", "cancelled")
    .required(),
});

module.exports = { authOrderSchema, guestOrderSchema, statusUpdateSchema };
