var models = require('../models')
  , Rental = models.Rental
  , _ = require('underscore')
  , fs = require('fs')

// GET /rentals
exports.index = function(req, res) {

  var query = {};
  if (req.param('type')) {
    console.log('Querying for type: ' + req.param('type'));
    query.type = req.param('type');
  }
  if (req.param('capacity')) {
    console.log('Querying for capacity: ' + req.param('capacity'));
    query.capacity = {$gte: Number(req.param('capacity'))}
  }
  if (req.param('price')) {
    console.log('Querying for price: ' + req.param('price'));
    query.price = {$lte: Number(req.param('price'))}
  }

  Rental.find(query, function(err, rentals) {
    if (err) {
      console.log('Could not retrieve list of rentals')
      console.log(err)
    }

    if (req.param('checkin') || req.param('checkout')) {
      var checkInDate = req.param('checkin') ? new Date(req.param('checkin')) : req.param('checkin');
      var checkOutDate = req.param('checkout') ? new Date(req.param('checkout')) : req.param('checkout');
      
      rentals.forEach(function(rental, idx) {
        if (!rental.checkDates(checkInDate, checkOutDate)) {
          rentals.splice(idx, 1);
        }
      });
    }

    res.jsonp(rentals)
  })
}

// POST /rentals
exports.create = function(req, res) {
  var newRental = new Rental(req.body)

  if (req.files) {
    _.each(_.keys(req.files), function(file) {
      if (req.files[file].size > 0) {
        newRental.images.push(fs.readFileSync(req.files[file].path))
      }
    })
  }

  newRental.save(function(err) {
    if (err) {
      console.log('Could not create new rental')
      console.log(err)
      if (err.name == 'ValidationError') {
        return res.jsonp(400, {error: err})
      } else {
        return res.jsonp(500, {error: err})
      }
    }

    res.jsonp(newRental)
  })
}

// GET /rentals/:id
exports.show = function(req, res) {
  console.log(req.params.id)
  Rental.findById(req.params.id, function(err, rental) {
    if (err) {
      console.log('Could not retrieve rental ' + req.params.rental)
      console.log(err)
    }

    res.jsonp(rental)
  })
}

// PUT /rentals/:id
exports.update = function(req, res) {
  Rental.update(req.params.id, req.body, function(err, numUpdated) {
    if (err) {
      console.log('Could not update rental ' + req.params.rental)
      console.log(err)
    }

    Rental.findById(req.params.id, function(err, rental) {
      if (err) {
        console.log('Could not retrieve rental ' + req.params.rental + ' after updating')
        console.log(err)
      }

      if (!req.files) {
        return res.jsonp(rental);
      }

      _.each(_.keys(req.files), function(file) {
        if (req.files[file].size > 0) {
          rental.images.push(fs.readFileSync(req.files[file].path));
        }
      })

      rental.save(function(err) {
        if (err) {
          console.log('Could not save rental');
          console.log(err);
        }

        res.jsonp(rental);
      });
    });
  });
}

// DELETE /rentals/:id
exports.destroy = function(req, res) {
  Rental.findById(req.params.rental, function(err, rental) {
    if (err) {
      console.log('Could not retrieve rental ' + req.params.rental)
      console.log(err)
    }

    rental.remove(function(err, rental) {
      if (err) {
        console.log('Could not remove rental ' + req.params.rental)
        console.log(err)
      }

      res.jsonp({status: 'ok'})
    })
  })
}