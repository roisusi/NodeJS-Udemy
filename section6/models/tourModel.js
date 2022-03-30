//----------//
// Requires //
//----------//

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const slugify = require('slugify');

//-----------//
// Database //
//----------//

const tourSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'A tour must have a name'], trim: true },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: { type: Number, required: [true, 'A tour must have a size'] },
    difficulty: { type: String, required: [true, 'A tour must have a difficulty'] },
    rating: { type: Number, default: 4.5 },
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    priceDiscount: { type: Number },
    summary: { type: String, trim: true },
    description: { type: String, trim: true },
    imageCover: { type: String, required: [true, 'A tour must have a cover image'] },
    images: [String],
    createAt: { type: Date, default: Date.now(), select: false }, // in mongoDB it converted auto to date , select :false hide it
    startDates: [Date], // in mongoDB it converted auto to date
    slug: { type: String },
    secretTour: { type: Boolean, default: false },
  },

  { toJSON: { virtuals: true }, toObject: { virtuals: true } } //options cant use in query DB
);

// Virtuals (not od db but on server document)
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create(). this point to document
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE:
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took : ${Date.now() - this.start} ms`);
  console.log(docs);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
// const testTour = new Tour({ name: 'The Parky', price: 497 });
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => console.error(err));
module.exports = Tour;
