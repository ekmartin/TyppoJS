(function(){
'use strict';

var game = require('../states/game').game;

var Cell = function(letter, color, x, y) {
  this.letter = letter;
  this.color = color;
  this.x = x;
  this.y = y;

  this.locked = false;
  this.faded = false;

  try {
    // not sure if this raises an error if the color is missing
    this.sprite = game.add.sprite(this.x, this.y, this.color + 'Cell');
    game.game.physics.enable(this.sprite, Phaser.Physics.arcade);
    this.sprite.body.setSize(this.sprite.body.width, this.sprite.body.height+1, 0, -1);
  }
  catch (e) {
    throw e + ' - Sprite missing, color: ' + this.color;
  }
  this.text = game.add.text(this.x+(this.sprite.width/2), this.y+(this.sprite.height/2)+5, this.letter, game.blockFontStyle);
  this.text.anchor.set(0.5, 0.5);
};

module.exports = Cell;

Cell.prototype.fade = function() {
  this.faded = true;
  this.text.setText('');
  this.sprite.loadTexture(this.color + 'Faded');
};

Cell.prototype.unFade = function() {
  this.faded = false;
  this.text.setText(this.letter);
  this.sprite.loadTexture(this.color + 'Cell');
};

Cell.prototype.destroy = function() {
  this.sprite.kill();
};

Cell.prototype.drop = function() {
  this.y += game.tileSize.y;
  this.sprite.body.y = this.y;
  this.text.y += game.tileSize.y;
};

Cell.prototype.lock = function() {
  this.locked = true;
  this.text.destroy();
};
}());
