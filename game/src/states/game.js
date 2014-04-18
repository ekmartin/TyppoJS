'use strict';

var game;

var Game = function() {
  game = this;

  this.blockFontStyle = {
    font: '32px Consolas',
    fill: '#fff'
  };

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
    this.player1.tick();
  },

  render: function() {
    /*
    if (this.player1.aliveBlocks.length > 0) {
      this.player1.walls.forEach(function(wall) {
        this.game.debug.body(wall);
      }, this);
      //this.game.debug.bodyInfo(this.player1.aliveBlocks[0].cellGroup.getAt(0), 20, 20);
      //this.game.debug.bodyInfo(this.player1.aliveBlocks[1].cellGroup.getAt(0), 20, 400);
      this.game.debug.body(this.player1.aliveBlocks[0].cellGroup.getAt(0));
    }
    */
  }
};

