(function(){
'use strict';

var Cell  = require('./cell'),
    game  = require('../states/game').game,
    _     = require('lodash');


var Block = function(wordObject, x) {
  this.word = wordObject.word.toUpperCase();
  this.color = wordObject.color;
  this.locked = false;
  this.id = wordObject.id;
  this.x = x;
  this.cellGroup = game.add.group(game.world, 'cellGroup', false);
  this.textGroup = game.add.group();
  this.cells = [];

  for (var i = 0, wordLength = this.word.length; i < wordLength; i++) {
    var cell = new Cell(this.word[i], this.color, {
      x: this.x+(i*game.tileSize.x),
      y: 0,
      realX: wordObject.x+i,
      realY: 0
    });
    this.cellGroup.add(cell.sprite);
    this.textGroup.add(cell.text);
    this.cells.push(cell);
  }

  this.next = {
    letter: this.word[0].toLowerCase(),
    cell: this.cells[0],
  };
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
        if (this.cells[i].sprite.game === null) {
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

Block.prototype.giveUp = function(dropCells, blocked) {
  this.resetNext();
  this.textGroup.destroy();
  for (var i = this.cells.length-1; i >= 0; i--) {
    if (this.cells[i].faded) {
      this.cells[i].sprite.destroy();
      this.cells.splice(i, 1);
    }
  }
};

Block.prototype.fadeNext = function() {
  this.next.cell.fade();
  var index = this.cells.indexOf(this.next.cell);
  if (index === this.cells.length-1) {
    // no more cells to fade.
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
