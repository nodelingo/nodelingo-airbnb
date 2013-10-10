var fs = require('fs')
  , path = require('path')
  , mongoose = require('mongoose');

module.exports = function(app) {
  mongoose.connect(app.get('mongodb_uri'));

  fs.readdirSync(__dirname).forEach(function(file) {
    if (file.indexOf('.js') == (file.length - 3)) {
      var name = file.substr(0, file.indexOf('_'))
      name = name.charAt(0).toUpperCase() + name.slice(1)

      exports[name] = require(path.join(__dirname, file))
    }
  })
}