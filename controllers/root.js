var models = require('../models')
  , Rental = models.Rental
  , imageinfo = require('imageinfo');

exports.index = function(req, res) {
  res.redirect('/airbnb.html');
}

exports.image = function(req, res) {
  var id = req.params.id;
  var idx = req.params.index;

  Rental.findById(id, function(err, rental) {
    if (err || !rental) {
      console.log('Could not find rental with _id ' + id)
      console.log(err);
      return res.send('id ' + id + ' not found');
    }

    var image = rental.images[idx];
    var metadata = imageinfo(image);

    if (metadata.mimeType) {
      res.type(metadata.mimeType);
    }

    res.send(rental.images[idx])
  });
}
