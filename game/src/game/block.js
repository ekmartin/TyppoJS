(function(){
'use strict';

var Cell  = require('./cell')
  , game  = require('../states/game').game;

var Block = function(word) {
  this.wordString = word.wordString.toUpperCase();
  this.color = word.color;
  this.locked = false;
  this.x = word.x;
  this.y = 0;
  this.cellGroup = game.add.group(game.world, 'cellGroup', false, true, Phaser.Physics.arcade);
  this.cells = [];

  /*this.wordString.forEach(function(c, i) {
    console.log('fE', this.wordString, c, i);
    var cell = new Cell(c, this.color, this.x+i*game.tileSize.x, this.y);
    this.cellGroup.add(cell.sprite);
    this.cells.push(cell);
  });*/

  for (var i = 0, wordLength = this.wordString.length; i < wordLength; i++) {
    var cell = new Cell(this.wordString[i], this.color, (this.x+i)*game.tileSize.x, this.y*game.tileSize.y);
    this.cellGroup.add(cell.sprite);
    this.cells.push(cell);
  }

  this.next = {
    letter: this.wordString[0].toLowerCase(),
    cell: this.cells[0],
  };
};

module.exports = Block;

Block.prototype.destroy = function() {
  this.cells.forEach(function(cell) {
    cell.destroy();
  });
};

Block.prototype.drop = function() {
  this.cells.forEach(function(cell) {
    cell.drop();
  }, this);
};

Block.prototype.lock = function() {
  this.cells.forEach(function(cell) {
    cell.lock();
  });
};

Block.prototype.fadeNext = function() {
  this.next.cell.fade();
  var index = this.cells.indexOf(this.next.cell);
  if (index === this.cells.length-1) {
    // no more cells to fade.
    this.next = {};
    return true;
  }
  else {
    this.next.letter = this.wordString[index+1].toLowerCase();
    this.next.cell = this.cells[index+1];
    return false;
  }
};
}());
