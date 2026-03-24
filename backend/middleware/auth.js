const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user.roles.some((role) => roles.includes(role))) {
      return res.status(403).json({
        message: `Role not authorized to access this route`,
      });
    }
    next();
  };
};

// Check active role specifically
const requireActiveRole = (role) => {
  return (req, res, next) => {
    if (req.user.activeRole !== role) {
      return res.status(403).json({
        message: `Switch to ${role} mode to perform this action`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize, requireActiveRole };