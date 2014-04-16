'use strict';

var game = require('../states/game').game;

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
    throw e + ' - Sprite missing, color: ' + this.color;
  }
};

module.exports = Cell;

Cell.prototype.fade = function() {
  // Error handling maybe? See cell constructor
  this.sprite.loadTexture(this.color + 'Faded');
};

Cell.prototype.unFade = function() {
  this.sprite.loadTexture(this.color + 'Cell');
};

Cell.prototype.destroy = function() {
  this.sprite.kill();
};

Cell.prototype.drop = function() {
  this.y++;
}
