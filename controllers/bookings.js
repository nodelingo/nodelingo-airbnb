var models = require('../models'),
    Rental = models.Rental;

// GET /rentals/:rental/bookings
exports.index = function(req, res) {
  var rentalId = req.params.rental;

  Rental.findById(rentalId, function(err, rental) {
    if (err) {
      console.log(err);
      var msg = 'Server error while retrieving rental ' + rentalId;
      return res.jsonp(500, {error: msg});
    }

    if (!rental) {
      var msg = 'Could not find rental with id ' + rentalId;
      console.log(msg);
      return res.jsonp(400, {error: msg});
    }

    return res.jsonp(rental.bookings);
  });
}

// POST /rentals/:rental/bookings
exports.create = function(req, res) {
  var rentalId = req.params.rental
    , startDate = new Date(req.body.startDate)
    , endDate = new Date(req.body.endDate);

  Rental.findById(rentalId, function(err, rental) {
    if (err) {
      console.log(err);     
      var msg = 'Server error while retrieving rental ' + rentalId;
      return res.jsonp(500, {error: msg});
    }

    if (!rental) {
      var msg = 'Could not find rental with id ' + rentalId;
      console.log(msg);
      return res.jsonp(400, {error: msg});
    }

    if (startDate > endDate) {
      var msg = 'Your start date is after your end date';
      return res.json(400, {error: msg});
    }

    if (!rental.checkDates(startDate, endDate)) {
      var msg = 'Listing is not available for the dates requested.';
      return res.json(400, {error: msg});
    }

    rental.bookings.push({checkInDate: startDate, checkOutDate: endDate});

    rental.save(function(err) {
      if (err) {
        console.log(err);
        var msg = 'Server error while saving rental ' + rentalId;
        return res.jsonp(500, {error: msg});
      }

      return res.jsonp(rental.bookings[rental.bookings.length-1]);
    });
  });
}

// GET /rentals/:rental/bookings/:booking
exports.show = function(req, res) {
  var rentalId = req.params.rental;
  var bookingId = req.params.booking;

  Rental.findById(rentalId, function(err, rental) {
    if (err) {
      console.log(err);
      var msg = 'Server error while retrieving rental ' + rentalId;
      return res.jsonp(500, {error: msg});
    }

    if (!rental) {
      var msg = 'Could not find rental with id ' + rentalId;
      console.log(msg);
      return res.jsonp(400, {error: msg});
    }

    if (!rental.bookings[bookingId]) {
      var msg = 'Could not find booking' + bookingId + ' for rental ' + rentalId;
      console.log(msg);
      return res.jsonp(400, {error: msg});
    }

    return res.jsonp(rental.bookings[bookingId]);
  });
}