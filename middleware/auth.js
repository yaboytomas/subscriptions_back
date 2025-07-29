const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth header received:', authHeader);

  const token = authHeader?.replace('Bearer ', '');
  console.log('Token extracted:', token ? 'TOKEN EXISTS' : 'NO TOKEN');

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied, no token provided' });
  }

  try {
    console.log('JWT_SECRET available:', process.env.JWT_SECRET ? 'YES' : 'NO');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
