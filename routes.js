var RootController = require('./controllers').RootController;

module.exports = function(app) {
  app.get('/', RootController.index);
}