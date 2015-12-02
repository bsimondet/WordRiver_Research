/**
 * Main application routes
 */

'use strict';
var passport = require('passport');
var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/contextPack', require('./api/contextPack'));
  app.use('/api/wordPack', require('./api/wordPack'));
  app.use('/api/word', require('./api/word'));
  app.use('/api/user', require('./api/user'));
  app.use('/api/student', require ('./api/student'));

  app.use('/auth', require('./auth'));
  app.use('/auth/google', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
