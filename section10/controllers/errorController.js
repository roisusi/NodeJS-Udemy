const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handelDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value `;
  return new AppError(message, 400);
};

const handelValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid field value: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorforDev = (err, res) => {
  res.status(err.statusCode).json({ status: err.status, message: err.message, error: err, stack: err.stack });
};

const sendErrorforProd = (err, res) => {
  //Operational. trusted error: send message to the client (comes from the AppError Class)
  if (err.isOperational) {
    res.status(err.statusCode).json({ status: err.status, message: err.message });
    //Programming error or unknown error: dont leak error to the client
  } else {
    //1. log error message
    console.log('Error !!!', err);
    //2. send error message
    res.status(500).json({ status: 'ERROR', message: err });
  }
};

module.exports = (err, req, res, next) => {
  //if status code not define then set it 500
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorforDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //type of errors from MongoDB
    let error = err;
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handelDuplicateFieldsDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handelValidationErrorDB(error);
    }
    sendErrorforProd(error, res);
  }
};
