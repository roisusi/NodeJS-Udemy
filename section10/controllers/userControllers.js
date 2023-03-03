//----------//
// Requires //
//----------//

// const fs = require('fs');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

//---------------//
// Function CRUD //
//---------------//


exports.readAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({status: 'success', results: users.length, data: {tour: users}});
});
exports.readOneUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};
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
