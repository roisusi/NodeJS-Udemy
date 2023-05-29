//----------//
// Requires //
//----------//

const express = require('express');
const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

//------------------//
// Global Variables //
//------------------//

const router = express.Router();
// const userRouter = express.Router();

//--------//
// Routes //
//--------//

//for authenticated users
router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router.post('/forgotPassword', authControllers.forgotPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);
router.patch('/updateMyPassword', authControllers.protect, authControllers.updatePassword);

//for users
router.route('/').get(userControllers.readAllUsers).post(userControllers.createUser);
router.route('/:id').get(userControllers.readOneUser).patch(userControllers.updateUser).delete(userControllers.deleteUser);
router.route('/edit/updateUser').patch(authControllers.protect, userControllers.updateUserById);
router.route('/edit/deleteUser').delete(authControllers.protect, userControllers.deleteUserById);

module.exports = router;
