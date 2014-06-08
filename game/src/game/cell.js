(function(){
'use strict';

var game  = require('../states/game').game;

var Cell = function(letter, color, positionOptions) {
  this.letter = letter;
  this.color = color;
  this.x = positionOptions.x;
  this.y = positionOptions.y;
  this.realX = positionOptions.realX;
  this.realY = positionOptions.realY;

  this.locked = false;
  this.faded = false;


  try {
    // not sure if this raises an error if the color is missing
    this.sprite = game.add.sprite(this.x, this.y, this.color + 'Cell');
  }
  catch (e) {
    throw e + ' - Sprite missing, color: ' + this.color;
  }


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
  this.sprite.loadTexture(this.color + 'Cell');
};

Cell.prototype.removeText = function() {
  // This removes the text for good.
  this.text.destroy();
};

Cell.prototype.drop = function(blocked) {
  if (!blocked[this.realY+1][this.realX]) {
    this.y += game.tileSize.y;
    this.text.y += game.tileSize.y;
    this.sprite.y = this.y;
    this.realY++;

    if (this.locked) {
      this.drop(blocked);
    }
  }
  else {
    return true;
  }

};

Cell.prototype.lock = function() {
  this.locked = true;
  this.text.destroy();
};
}());
