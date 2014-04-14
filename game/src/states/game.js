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

var TypeGame = function(width, height, positionX, positionY) {
  console.log('ja?', (positionX + width*game.tileSize.x));
  if (positionX + width*game.tileSize.x < game.game.width && positionY + height*game.tileSize.y < game.game.height) {
    this.width = width;
    this.height = height;
    this.realWidth = width*game.tileSize.x;
    this.realHeight = height*game.tileSize.y;
    this.x = positionX;
    this.y = positionY;
    this.walls  = game.add.group();
    for (var x = 0; x < this.width; x += 1) {
      console.log("x: ", x);
      for (var y = 0; y < this.height; y += 1) {
        var cell;
        if (x === 0 || x === (this.width-1) || y === (this.height-1)) {
          cell = this.walls.create(x*game.tileSize.x + this.x, y*game.tileSize.y + this.y, 'wallTile');
        }
        else {
          cell = this.walls.create(x*game.tileSize.x + this.x, y*game.tileSize.y + this.y, 'bgTile');
        }
        game.game.physics.enable(cell, Phaser.Physics.arcade);
        cell.body.immovable = true;
      }
    }
  }
  else {
    throw 'TypeGame goes outside the game width.';
  }
};

TypeGame.prototype.getEndX = function() {
  return this.x + this.realWidth;
};

Game.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.Arcade);
    var player1 = new TypeGame(15, 20, 0, 0);
    var player2 = new TypeGame(15, 20, player1.getEndX() + this.tileSize.x, 0);
    this.stage.backgroundColor = '#fff';
  },

  update: function() {
  },
};
