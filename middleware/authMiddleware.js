// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// ✅ Middleware to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log("✅ TOKEN DECODED:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ TOKEN ERROR:", err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// ✅ Middleware to check if user is admin
function verifyAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
}

module.exports = { verifyToken, verifyAdmin };
