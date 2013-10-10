var fs = require('fs')
  , path = require('path')

fs.readdirSync(__dirname).forEach(function(file) {
  if (file.indexOf('.js') == (file.length - 3)) {
    var name = file.substr(0, file.indexOf('.js'))
    name = name.charAt(0).toUpperCase() + name.slice(1)

    exports[name + 'Controller'] = require(path.join(__dirname, file))
  }
})