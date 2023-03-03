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

//for users
router.route('/').get(userControllers.readAllUsers).post(userControllers.createUser);
router.route('/:id').get(userControllers.readOneUser).patch(userControllers.updateUser).delete(userControllers.deleteUser);

module.exports = router;
