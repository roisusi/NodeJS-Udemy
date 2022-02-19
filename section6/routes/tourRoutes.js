//----------//
// Requires //
//----------//

const express = require('express');
const tourController = require('../controllers/tourControllers');

//------------------//
// Global Variables //
//------------------//

const tourRouter = express.Router();

//------------//
// Middleware //
//------------//

tourRouter.param('id', tourController.CheckID);

//--------//
// Routes //
//--------//

tourRouter.route('/').get(tourController.readAllTours).post(tourController.CheckBody, tourController.createTour);
tourRouter.route('/:id').get(tourController.readOneTour).patch(tourController.updateTour).delete(tourController.deleteTour);

module.exports = tourRouter;
