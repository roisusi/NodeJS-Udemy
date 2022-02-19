//----------//
// Requires //
//----------//

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

//------------------//
// Global Variables //
//------------------//

const port = process.env.PORT || 8000;

//-----------//
// Listeners //
//-----------//

app.listen(port, () => {
  console.log(`Running on port : ${port}`);
});
