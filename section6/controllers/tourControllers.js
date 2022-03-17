//----------//
// Requires //
//----------//

// const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

// //-----------------//
// // Read JSON files //
// //-----------------//

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

//------------//
// Middleware //
//------------//

// exports.CheckID = (req, res, next, value) => {
//   if (value * 1 > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }
//   next();
// };

// exports.CheckBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({ status: 'fail', message: 'name and price donest contained' });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.readTOurStats = (req, res, next) => {
  try {
    const stats = Tour.aggregate([]);
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
//---------------//
// Function CRUD //
//---------------//

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};
exports.readAllTours = async (req, res) => {
  try {
    //Execute Query
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().limit().pagination();
    const tours = await features.query;

    //Send Respond
    // const tours = await Tour.find().where('duration').equals(5).where('ratingsQuantity').equals(35); // query
    res.status(200).json({ status: 'success', results: tours.length, data: { tour: tours } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
exports.readOneTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: 'success', data: { tour: tour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { tour: tour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

// exports.readAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     requestAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// };
// exports.readOneTour = (req, res) => {
//   const id = req.params.id * 1; // the * 1 is to turn it to int
//   const tour = tours.find((element) => element.id === id);
//   res.status(200).json({
//     status: 'success',
//     data: { tour },
//   });
// };
// exports.createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign(...{ id: newId }, req.body);
//   tours.push(newTour);
//   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), () => {
//     res.status(201).json({ status: 'success', data: { tours: newTour } });
//   });
// };
// exports.updateTour = (req, res) => {
//   res.status(200).json({ status: 'success', tour: '<Updated>' });
// };
// exports.deleteTour = (req, res) => {
//   res.status(204).json({ status: 'success', data: null });
// };
