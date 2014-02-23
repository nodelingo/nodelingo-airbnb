var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId

var RENTAL_TYPES = [
  'Entire home',
  'Private room',
  'Shared room'
]

var Bookings = new Schema({
    numberOfGuests: Number,
    checkInDate: Date,
    checkOutDate: Date,
    totalPrice: Number
});

var Rentals = new Schema({
  type: { type: String, enum: RENTAL_TYPES },
  capacity: Number,
  price: Number,
  title: String,
  description: String,
  location: String,
  images: [Buffer],
  bookings: [Bookings]
}, {collection: 'places'})

Rentals.virtual('image_urls')
  .get(function() {
    var urls = [];

    for (var x=0; x < this.images.length; x++) {
      urls.push('/images/' + String(this._id) + '/' + String(x));
    }

    return urls
  })

Rentals.methods.checkDates = function checkDates(checkIn, checkOut) {
  var valid = true;

  if (checkIn && checkOut) {
    this.bookings.forEach(function(booking) {
      if (checkIn < booking.checkOutDate && checkOut > booking.checkInDate) {
        valid = false;
      }
    });
  } else if (checkIn && !checkOut) {
    this.bookings.forEach(function(booking) {
      if (checkIn > booking.checkInDate && checkIn < booking.checkOutDate) {
        valid = false;
      }
    });
  } else if (!checkIn && checkOut) {
    this.bookings.forEach(function(booking) {
      if (checkOut > booking.checkInDate && checkOut < booking.checkOutDate) {
        valid = false;
      }
    });
  }

  return valid;
}

Rentals.set('toJSON', { virtuals: true, hide: 'images', transform: true });

Rentals.options.toJSON.transform = function transform(doc, ret, options) {
  if (options.hide) {
    options.hide.split(' ').forEach(function(prop) {
      delete ret[prop];
    });
  }
}

module.exports = mongoose.model('Rental', Rentals)