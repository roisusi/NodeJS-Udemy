//----------//
// Requires //
//----------//

const fs = require('fs');

//-----------------//
// Read JSON files //
//-----------------//

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

//------------//
// Middleware //
//------------//

exports.CheckID = (req, res, next, value) => {
  if (value * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  next();
};

exports.CheckBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({ status: 'fail', message: 'name and price donest contained' });
  }
  next();
};

//---------------//
// Function CRUD //
//---------------//

exports.readAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};
exports.readOneTour = (req, res) => {
  const id = req.params.id * 1; // the * 1 is to turn it to int
  const tour = tours.find((element) => element.id === id);
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(...{ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), () => {
    res.status(201).json({ status: 'success', data: { tours: newTour } });
  });
};
exports.updateTour = (req, res) => {
  res.status(200).json({ status: 'success', tour: '<Updated>' });
};
exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};
