export function errorHandler(err, req, res, next) {
  console.error(`[error] ${req.method} ${req.path} ->`, err.message);

  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Something went wrong on our end.'
      : err.message;

  res.status(status).json({
    success: false,
    error: message,
    ...(err.details && { details: err.details }),
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.path}`,
  });
}