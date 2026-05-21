const User = require('../models/User');
const { verifyToken } = require('../utils/token');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Not authorized, token signature failed' });
      }
      
      // Get user from the token and attach to request
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }
      
      next();
    } catch (error) {
      console.error(`[Auth Middleware Error] ${error.message}`);
      res.status(401).json({ success: false, message: 'Not authorized, token validation crashed' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Not authorized, no bearer token supplied' });
  }
};

module.exports = { protect };
