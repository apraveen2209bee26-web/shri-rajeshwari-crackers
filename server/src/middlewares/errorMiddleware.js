const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || res.statusCode || 500;
  const message = error.message || 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  });
};

export { notFound, errorHandler };

