//----------//
// Requires //
//----------//

const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authControllers');

//------------------//
// Global Variables //
//------------------//

const tourRouter = express.Router();

//------------//
// Middleware //
//------------//

// tourRouter.param('id', tourController.CheckID);

//--------//
// Routes //
//--------//

// tourRouter.route('/').get(tourController.readAllTours).post(tourController.CheckBody, tourController.createTour); //check tourController.CheckBody before post
tourRouter.route('/tour-stats').get(tourController.readTourStats);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
tourRouter.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.readAllTours);
tourRouter.route('/').get(authController.protect, tourController.readAllTours).post(tourController.createTour);
tourRouter
  .route('/:id')
  .get(tourController.readOneTour)
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = tourRouter;
