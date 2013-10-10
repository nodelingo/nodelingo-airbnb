var fs = require('fs')
  , path = require('path')
  , config = require('../config')
  , mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect(config.mongodb.uri);

  fs.readdirSync(__dirname).forEach(function(file) {
    if (file.indexOf('.js') == (file.length - 3)) {
      var name = file.substr(0, file.indexOf('_'))
      name = name.charAt(0).toUpperCase() + name.slice(1)

      exports[name] = require(path.join(__dirname, file))
    }
  })
}