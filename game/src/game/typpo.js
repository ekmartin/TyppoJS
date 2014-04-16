'use strict';

var Block = require('./block')
  , game  = require('../states/game').game;


var Typpo = function (width, height, positionX, positionY) {
  if (positionX + width*game.tileSize.x < game.game.width && positionY + height*game.tileSize.y < game.game.height) {
    this.width = width;
    this.height = height;
    this.realWidth = width*game.tileSize.x;
    this.realHeight = height*game.tileSize.y;
    this.x = positionX;
    this.y = positionY;
    this.walls  = game.add.group();

    this.dropTreshold = 4;
    this.dropCounter = this.dropTreshold;

    this.blocks = [];

    this.testWord = {
      wordString: 'test',
      color: 'blue',
      x: (5*game.tileSize.x)+this.x
    };
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
    throw 'Typpo goes outside the game width.';
  }
};


Typpo.prototype.getEndX = function() {
  return this.x + this.realWidth;
};

Typpo.prototype.dropBlocks = function() {
  this.blocks.forEach(function(block) {
    // TODO: Add locked/grey check.
    block.drop();
  }, this);

  if (this.dropCounter >= this.dropTreshold) {
    this.addBlock(this.testWord);
  }
};

Typpo.prototype.addBlock = function(word) {
  if (word.wordString !== undefined) {
    console.log(word.x);
    this.blocks.push(new Block(word));
  }
  else {
    throw 'Word ' + word + ' does not have a wordString.';
  }
};

module.exports = Typpo;
