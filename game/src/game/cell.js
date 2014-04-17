'use strict';

var game = require('../states/game').game;

var Cell = function(letter, color, x, y) {
  this.letter = letter;
  this.color = color;
  this.x = x;
  this.y = y;

  this.alive = true;

  try {
    // not sure if this raises an error if the color is missing
    this.sprite = game.add.sprite(this.x, this.y, this.color + 'Cell');
    game.game.physics.enable(this.sprite, Phaser.Physics.arcade);
    this.sprite.body.setSize(this.sprite.body.width, this.sprite.body.height+1, 0, -1);
  }
  catch (e) {
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
  // TODO: Add checks (lock etc)
  this.y += game.tileSize.y;
  this.sprite.body.y = this.y;
  //this.sprite.body.velocity.y = 50;
};

Cell.prototype.lock = function() {
  this.alive = false;
};
