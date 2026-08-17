module.exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const errorMessage = err.message || "Internal Server Error";

  console.log(`Error ${statusCode} - ${errorMessage} `);

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: errorMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
