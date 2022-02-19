//----------//
// Requires //
//----------//

const express = require('express');
const userControllers = require('./../controllers/userControllers');

//------------------//
// Global Variables //
//------------------//

const userRouter = express.Router();

//--------//
// Routes //
//--------//

// routes //
userRouter.route('/').get(userControllers.readAllUsers).post(userControllers.createUser);
userRouter.route('/:id').get(userControllers.readOneUser).patch(userControllers.updateUser).delete(userControllers.deleteUser);

module.exports = userRouter;
