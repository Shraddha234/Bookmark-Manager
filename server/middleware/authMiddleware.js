const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token and extract user information
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    console.log('No token found');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token.split(' ')[1], process.env.SECRET_KEY); 
    console.log('Token:', token);
    console.log('Decoded token:', decodedToken);
    req.user = decodedToken.data;
    // req.email = decodedToken.data.email; // Assuming the email is stored in the 'email' property of the token's 'data' object
    // req.userName = decodedToken.data.email;
    next();
  } catch (error) {
    console.log('Error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateUser;

