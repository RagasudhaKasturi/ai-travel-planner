/**
 * Centralized error handler. Controllers call next(error) (or async
 * wrapper rejects) and this turns it into a consistent, safe JSON
 * response instead of leaking stack traces or crashing the process.
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(' ') });
  }

  // Mongoose duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `That ${field} is already in use.` });
  }

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier supplied.' });
  }

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  return res.status(statusCode).json({
    message: err.message || 'Something went wrong on the server.'
  });
}

function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };
