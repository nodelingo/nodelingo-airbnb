var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.mongodb.uri);

exports.Rental = require('./rental');
