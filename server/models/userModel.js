const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  email: { // Add the email field to store the user's email ID
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter the Password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
