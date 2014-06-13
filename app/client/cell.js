(function(){
'use strict';

var game  = require('./states/game').game;

var Cell = function(letter, color, positionOptions) {
  this.letter = letter;
  this.color = color;
  this.x = positionOptions.x;
  this.y = positionOptions.y;
  this.origX = positionOptions.origX;
  this.origY = positionOptions.origY;

  this.locked = !!letter ? false : true;
  this.givenUp = false;

  this.faded = false;

  this.sprite = game.add.sprite(this.x, this.y, this.color + 'Tile');

  this.text = game.add.text(this.x+game.tileSize.x/2,
    this.y+game.tileSize.y/2, this.letter, {
    fill: '#fff',
    align: 'center'
  });

  this.text.anchor.setTo(0.5);

  this.text.font = 'Droid Sans Mono';

};

module.exports = Cell;

Cell.prototype.fade = function() {
  this.faded = true;
  this.sprite.loadTexture(this.color + 'Faded');
};

Cell.prototype.removeText = function() {
  // This removes the text for good.
  this.text.destroy();
};

Cell.prototype.removeSprite = function() {
  this.sprite.destroy();
}

Cell.prototype.drop = function(blocked) {
  if (!blocked[this.origY+1][this.origX]) {
    this.y += game.tileSize.y;
    this.text.y += game.tileSize.y;
    this.sprite.y = this.y;
    this.origY++;

    if (this.locked) {
      this.drop(blocked);
    }
  }
  else {
    return true;
  }
};

Cell.prototype.up = function() {
  this.origY--;
  this.y -= game.tileSize.y;
  this.text.y -= game.tileSize.y;
  this.sprite.y = this.y;

  return this.origY < 0;
};

Cell.prototype.giveUp = function() {
  console.log('giving up cell');
  this.givenUp = true;
  this.removeText();
  if (this.faded) {
    this.removeSprite();
  }
};

Cell.prototype.lock = function() {
  this.locked = true;
  this.removeText();
  if (this.faded) {
    this.removeSprite();
  }
};
}());
