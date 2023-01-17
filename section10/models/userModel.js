//----------//
// Requires //
//----------//

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const validator = require('validator');

//-----------//
// Database //
//----------//

//validators are check in create or in runValidators true in others , that is build in and custom
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: 8,
  },
  passwordConfirmation: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
