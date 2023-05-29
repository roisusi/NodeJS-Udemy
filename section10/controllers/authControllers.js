const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const CreateSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  return res.status(statusCode).json({
    status: 'success',
    data: {
      user: user,
    },
    token,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  CreateSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exists
  if (!email && !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2) Check if user exists && password is correct
  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3) If everything is fine, send token to client
  CreateSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1) Get token and check if it's there
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  //2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('User not found', 401));
  }

  //4) Check if user changed password after the token was issued
  if (await currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password, Please login again', 401));
  }

  //Grant Access To Protected Route
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  //roles are array of strings and need to check if user has role
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  // 2) Create reset token
  // This token is not the encrypted one
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send reset token to user
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PATCH request to: \n\n ${resetUrl}`;
  try {
    await sendEmail({ email: user.email, subject: 'Password Reset Token', message });

    res.status(200).json({ status: 'success', message: 'Check your email for the reset link' });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Email could not be sent', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, //if token has expired greater than now
  });
  if (!user) {
    return next(new AppError('Password reset token is invalid or has expired', 400));
  }

  // 2) If the token has not expired, and there is a user with that token, set the new password
  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // at user model file

  // 4) Log the user in, send JWT
  CreateSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from the collection
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  // 2) check if the current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Current password is incorrect', 401));
  }
  // 3) Update the password
  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  await user.save();
  //dont use User.findByIdAndUpdate

  // 4) Log the user in, send JWT
  CreateSendToken(user, 200, res);
});
