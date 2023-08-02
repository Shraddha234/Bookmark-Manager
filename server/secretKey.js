const crypto = require('crypto');
const fs = require('fs');

// Generate a 32-byte random string as the secret key
const secretKey = crypto.randomBytes(32).toString('hex');

// Write the secret key to a file (e.g., .env.secret)
fs.writeFileSync('.env.secret', `SECRET_KEY=${secretKey}`);
console.log('Secret key generated and saved to .env.secret');