'use strict';

var browserify = require('browserify-middleware');

module.exports = function(app) {

  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/game.js', browserify('./game/src/main.js'));
};
