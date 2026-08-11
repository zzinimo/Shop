const Joi = require("joi");

const subscriberJoiSchema = Joi.object({
  email: Joi.string().required().email().trim(),
});

const validateEmail = async (req, res, next) => {
  try {
    await subscriberJoiSchema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
};

module.exports = { validateEmail };
