//----------//
// Requires //
//----------//

const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorConstractur');

//------------------//
// Global Variables //
//------------------//

const app = express();

//------------//
// Middleware //
//------------//

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(express.static(`${__dirname}/public/`));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //writes the request like GET /api/v1/tours 200 2.610 ms - 8679 on the console
}

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// * - Everything
//Doing it only in the last
// app.all('*', (req, res, next) => {
//   res.status(404).json({ status: 'fail', message: `Can't find ${req.originalUrl} on this server!` });
// });

//Create an Error (i // the previous app.all)
app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  //if next() get an argument is automatically pass it to error
  //it skip all the other middleware
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
});

//Using ErrorHandler
app.use(globalErrorHandler);

module.exports = app;
