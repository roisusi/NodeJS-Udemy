//----------//
// Requires //
//----------//

//uncaught Exception
//for sync handlers
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 🧨 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');

const app = require('./app');

//------------------//
// Global Variables //
//------------------/++/

const port = process.env.PORT || 8000;

//-----------//
// Database //
//----------//

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true }).then(() => {
  console.log('MongoDB connected');
});

//-----------//
// Listeners //
//-----------//

const server = app.listen(port, () => {
  console.log(`Running on port : ${port}`);
});

//unhandled rejections for async code
//this is a event listener
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION! 🧨 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
