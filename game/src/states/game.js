'use strict';

var game;

var Game = function() {
  game = this;

  this.tileSize = {
    x: 32,
    y: 32
  };
};

module.exports = Game;

Game.prototype = {
  create: function() {
    // Might be a bit hacky? Might be a better way to do it, but TypeGame needs to know
    module.exports.game = this;
    this.Typpo = require('../game/typpo');

    this.game.physics.startSystem(Phaser.Physics.Arcade);
    this.player1 = new this.Typpo(15, 20, 0, 0);
    this.player2 = new this.Typpo(15, 20, this.player1.getEndX() + this.tileSize.x, 0);
    this.stage.backgroundColor = '#fff';
  },

  update: function() {
    this.player1.dropBlocks();
  },
};

