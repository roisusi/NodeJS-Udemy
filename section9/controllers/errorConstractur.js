module.exports = (err, req, res, next) => {
  //if status code not define then set it 500
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({ status: err.status, message: err.message });
};
