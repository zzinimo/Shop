const Joi = require("joi");

const ordersJoiSchema = Joi.object({
  guestEmail: Joi.string().lowercase().email(),
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("'userId must be a valid MongoDB ObjectId'"),
  customer: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).messages({
      "string.empty": "First name cannot be empty",
      "any.required": "First name is required",
    }),
    lastName: Joi.string().trim().min(2).max(50).messages({
      "string.empty": "Last name cannot be empty",
      "any.required": "Last name is required",
    }),
    email: Joi.string()
      .lowercase()
      .required()
      .email()
      .trim()
      .message("email is required and must be a valid email address"),
  }),

  shippingAddress: Joi.object({
    address: Joi.string()
      .required()
      .trim()
      .message("Shipping address is required"),
  }),

  items: Joi.array()
    .items(
      Joi.object({
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().min(0).required(),
        productId: Joi.string().required(),
        src: Joi.string().require().trim(),
        description: Joi.string().required(),
      }),
    )
    .min(1)
    .required(),

  totals: Joi.object({
    subtotal: Joi.number().required().min(0),
    shipping: Joi.number().required().min(0),
    total: Joi.number().required().min(0),
  }),
  status: Joi.string()
    .valid("pending", "paid", "shipped", "delivered", "cancelled")
    .default("pending"),
});
