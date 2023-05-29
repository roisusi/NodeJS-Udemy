//----------//
// Requires //
//----------//

// const fs = require('fs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//---------------//
// Data Updating //
//---------------//
const filterObj = (obj, ...alllowedfields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (alllowedfields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.updateUserById = catchAsync(async (req, res, next) => {
  // 1) create error if user try to update password
  if (req.body.password || req.body.passwordConfirmation) {
    return next(new AppError('This route is not for password update', 400));
  }
  // 2) never use req.body so filter it
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });
  res.status(200).json({ status: 'success', data: { user: updateUser } });
});

exports.deleteUserById = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: 'success', data: null });
});

//---------------//
// Function CRUD //
//---------------//

exports.readAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ id: req.params.id });
  res.status(200).json({ status: 'success', results: users.length, data: { tour: users } });
});

exports.readOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  return res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
