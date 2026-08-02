const validateOrder = (schema) => {
  return async (req, res, next) => {
    try {
      const options = {
        abortEarly: false,
      };

      const validatedData = await schema.validateAsync(req.body, options);

      req.body = validatedData;
      return next();
    } catch (err) {
      if (err.isJoi) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: err.details.map((detail) => detail.message),
        });
      }

      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };
};

module.exports = validateOrder;
