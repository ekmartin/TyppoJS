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
  console.log('letter', letter, !!letter, this.locked);
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
  console.log(this.color + 'Faded');
  this.sprite.loadTexture(this.color + 'Faded');
};

Cell.prototype.unFade = function() {
  this.faded = false;
  this.sprite.loadTexture(this.color + 'Tile');
};

Cell.prototype.removeText = function() {
  // This removes the text for good.
  this.text.destroy();
};

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

Cell.prototype.lock = function() {
  this.locked = true;
  this.text.destroy();
  if (this.faded) {
    this.sprite.destroy();
  }
};
}());
