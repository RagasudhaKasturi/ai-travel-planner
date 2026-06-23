const jwt = require('jsonwebtoken');

/**
 * Verifies the Bearer token on protected routes and attaches the decoded
 * payload (containing the user id) to req.user. Every downstream
 * controller relies on req.user.id to scope database queries, which is
 * what guarantees strict per-user data isolation.
 */
function protect(req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Access denied. Missing or malformed authorization token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

module.exports = protect;
