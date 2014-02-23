var BookingsController = require('./controllers').BookingsController
  , RentalsController = require('./controllers').RentalsController
  , RootController = require('./controllers').RootController;

module.exports = function(app) {
  app.get('/rentals', RentalsController.index);
  app.post('/rentals', RentalsController.create);
  app.get('/rentals/:id', RentalsController.show);
  app.put('/rentals/:id', RentalsController.update);
  app.delete('/rentals/:id', RentalsController.destroy);

  app.get('/rentals/:rental/bookings', BookingsController.index);
  app.post('/rentals/:rental/bookings', BookingsController.create);
  app.get('/rentals/:rental/bookings/:booking', BookingsController.show);

  app.get('/', RootController.index);
  app.get('/images/:id/:index', RootController.image);
}
