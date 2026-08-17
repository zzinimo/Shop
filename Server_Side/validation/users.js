const Joi = require("joi");

const userFields = {
  email: Joi.string().lowercase().trim().email().required(),
  password: Joi.string().min(5).max(100).required(),
};

const createUserSchema = Joi.object({
  ...userFields,
  username: Joi.string().trim().min(3).max(20).required(),
});

const loginSchema = Joi.object(userFields);

const validateUser = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validateAsync(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    return next();
  } catch (error) {
    return res.status(400).json({
      message: "Invalid user data",
      errors: error.details.map((detail) => detail.message),
    });
  }
};

module.exports = { createUserSchema, loginSchema, validateUser };
