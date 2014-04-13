'use strict';

var Phaser = require('Phaser')
  , Preloader   = function() {};

module.exports = Preloader;

Preloader.prototype = {
  preload: function() {
    // Load everything needed for the preloader state.
  },

  create: function() {
    this.game.state.start('Menu');
  }
};
