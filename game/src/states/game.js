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

var Cell = function(letter, color, x, y) {
  this.letter = letter;
  this.color = color;
  this.x = x;
  this.y = y;

  try {
    // not sure if this raises an error if the color is missing
    this.sprite = game.add.sprite(this.x, this.y, this.color + 'Cell');
  }
  catch(e) {
    throw 'Sprite missing, color: ' + this.color;
  }
};

Cell.prototype.fade = function() {
  // Error handling maybe? See cell constructor
  this.sprite.loadTexture(this.color + 'Faded');
};

Cell.prototype.unFade = function() {
  this.sprite.loadTexture(this.color + 'Cell');
}

var Block = function(word) {
  this.wordString = word.wordString;
  this.color = word.color;
  this.locked = false;
  this.x = word.x;
  this.y = 0;

  this.cellGroup = game.add.group();
  this.cells = [];
  for (var i = 0, wordLength = this.wordString.length; i < wordLength; i++) {
    var cell = new Cell(this.wordString[i], this.color, this.x+i*game.tileSize.x, this.y);
    this.cellGroup.add(cell.sprite);
    this.cells.push(cell);
  }

};

var TypeGame = function (width, height, positionX, positionY) {
  if (positionX + width*game.tileSize.x < game.game.width && positionY + height*game.tileSize.y < game.game.height) {
    this.width = width;
    this.height = height;
    this.realWidth = width*game.tileSize.x;
    this.realHeight = height*game.tileSize.y;
    this.x = positionX;
    this.y = positionY;
    this.walls  = game.add.group();
    for (var x = 0; x < this.width; x += 1) {
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
