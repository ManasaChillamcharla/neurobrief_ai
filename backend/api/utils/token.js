const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'neurobrief_quantum_secret_key_987234';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '30d' // Token valid for 30 days
  });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'neurobrief_quantum_secret_key_987234';
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
