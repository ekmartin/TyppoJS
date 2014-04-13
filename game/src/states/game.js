'use strict';

var Phaser = require('Phaser')
  , Game   = function() {};

module.exports = Game;

var TypeGame = function(width, height) {
  this.map = this.game.add.tilemap('map');
};

Game.prototype = {
  create: function() {
  },

  update: function() {
  },
};
