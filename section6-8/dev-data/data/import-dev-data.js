/* eslint-disable import/newline-after-import */
//----------//
// Requires //
//----------//

const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

//-----------//
// Database //
//----------//

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true }).then(() => {
  console.log('MongoDB connected');
});

//-----------------//
// Read JSON files //
//-----------------//

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));

//import data to Database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfull loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//delete all data from collections
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfull deleted!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
  console.log(process.argv);
}

if (process.argv[2] === '--delete') {
  deleteData();
  console.log(process.argv);
}
