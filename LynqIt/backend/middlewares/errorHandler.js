import logger from "../utils/logger.js";
import { AppError } from "../utils/errors/AppError.js";

// Handle invalid MongoDB ObjectId or malformed IDs
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

// Handle duplicate field errors in MongoDB
const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue
    ? JSON.stringify(err.keyValue)
    : err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || "Duplicate value";
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(400, message);
};

// Handle validation errors from Mongoose
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors || {}).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(400, message);
};

// JWT-specific errors
const handleJWTError = () =>
  new AppError(401, "Invalid token. Please log in again!");

const handleJWTExpiredError = () =>
  new AppError(401, "Your token has expired! Please log in again.");

// Error response for development environment
const sendErrorDev = (err, res) => {
  logger.error("ERROR 🔥", {
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Error response for production environment
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Known, trusted error (like validation, duplicate, etc.)
    logger.error("Operational Error:", {
      status: err.status,
      message: err.message,
    });

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Unknown or programming errors
    logger.error("Unknown Error:", { error: err });

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

// Global Error Handler Middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  } else {
    // Default fallback if NODE_ENV not set
    sendErrorDev(err, res);
  }
};

export default globalErrorHandler;
