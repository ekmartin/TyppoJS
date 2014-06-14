(function(){
'use strict';

var Cell          = require('./cell'),
    _             = require('lodash'),
    gameConstants = require('../common/game-constants');


var Block = function(game, render, isGrey, blockObject, x, y) {

  this.x = x;
  this.blockObject = blockObject;
  this.cells = [];
  this.isGrey = isGrey;
  this.givenUp = false;
  this.render = render;

  if (this.render) this.cellGroup = game.add.group(game.world, 'cellGroup', false);

  if (isGrey === false) {
    // Add a regular block
    this.word = blockObject.word.toUpperCase();
    this.color = blockObject.color;
    this.locked = false;
    this.id = blockObject.id;

    if (this.render) this.textGroup = game.add.group();

    for (var i = 0, wordLength = this.word.length; i < wordLength; i++) {
      var cell = new Cell(game, this.render, this.word[i], this.color, {
        x: this.x+(i*gameConstants.TILE_SIZE.x),
        y: y,
        origX: blockObject.x+i,
        origY: 0
      });

      if (this.render) {
        this.cellGroup.add(cell.sprite);
        this.textGroup.add(cell.text);
      }

      this.cells.push(cell);
    }

    this.next = {
      letter: this.word[0].toLowerCase(),
      cell: this.cells[0],
    };
  }
  else if (isGrey === true) {
    // This means the constructor was called to add a grey row, and blockObject thus
    // refers to the width of the game.
    this.color = 'locked';
    this.locked = true;

    for (var j = blockObject.x; j < gameConstants.WIDTH-gameConstants.RIGHT_WALL; j++) {
      var greyCell = new Cell(game, this.render, '', this.color, {
        x: this.x+(j*gameConstants.TILE_SIZE.x),
        y: y,
        origX: j,
        origY: blockObject.y
      });

      if (this.render) this.cellGroup.add(greyCell.sprite);

      this.cells.push(greyCell);
    }
  }
  else {
    throw new Error('isGrey can only be true/false.');
  }
};

module.exports = Block;

Block.prototype.destroy = function() {
  this.cells.forEach(function(cell) {
    cell.destroy();
  });
};

Block.prototype.drop = function(blocked) {
  _.some(this.cells, function(cell) {
    if (cell.drop(blocked) === true) {
      this.locked = true;

      for (var i = this.cells.length-1; i >= 0; i--) {
        this.cells[i].lock();
        this.cells[i].drop(blocked);
        if (this.cells[i].faded) {
          this.cells.splice(i, 1);
        }
      }
      return true;
    }
  }, this);
};

Block.prototype.lock = function() {
  this.cells.forEach(function(cell) {
    cell.lock();
  });
};

Block.prototype.resetNext = function() {
  this.next = {
    letter: null,
    cell: null
  };
};

Block.prototype.giveUp = function(blocked) {
  this.givenUp = true;

  this.resetNext();

  for (var i = this.cells.length-1; i >= 0; i--) {
    this.cells[i].giveUp();
    if (this.cells[i].faded) {
      this.cells.splice(i, 1);
    }
  }
};

Block.prototype.up = function() {
  return _.some(this.cells, function(cell) {
    return cell.up();
  });
};

Block.prototype.fadeNext = function() {
  if (this.next.cell === null) {
    console.log("se her", this);
  }
  this.next.cell.fade();
  var index = this.cells.indexOf(this.next.cell);
  if (index === this.cells.length-1) {
    // no more cells to fade.

    if (this.render) {
      this.cellGroup.destroy();
      this.textGroup.destroy();
    }

    this.resetNext();
    return true;
  }
  else {
    this.next.letter = this.word[index+1].toLowerCase();
    this.next.cell = this.cells[index+1];
    return false;
  }
};
}());
