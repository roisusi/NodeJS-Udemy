//----------//
// Requires //
//----------//

const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//------------------//
// Global Variables //
//------------------//

const app = express();

//------------//
// Middleware //
//------------//
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //writes the request like GET /api/v1/tours 200 2.610 ms - 8679 on the console
}
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use(express.static(`${__dirname}/public/`));

module.exports = app;
