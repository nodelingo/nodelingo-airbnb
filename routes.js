var Root = require('./controllers').Root;

module.exports = function(app) {
  app.get('/', Root.index);
}