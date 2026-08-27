/**
 * Central error handler. Keeps stack traces and internal details out of
 * responses in production, so backend errors are never exposed to users.
 */
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Mongoose duplicate key (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `That ${field} is already in use` });
  }

  // Malformed ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id" });
  }

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Something went wrong. Please try again."
      : err.message;

  res.status(statusCode).json({ message });
};
