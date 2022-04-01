//----------//
// Requires //
//----------//

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');

const app = require('./app');

//------------------//
// Global Variables //
//------------------//

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

app.listen(port, () => {
  console.log(`Running on port : ${port}`);
});
