(function(){
'use strict';

var gameConstants = require('../common/game-constants');

var Cell = function(game, render, letter, color, positionOptions) {
  this.game = game;

  this.letter = letter;
  this.color = color;
  this.x = positionOptions.x;
  this.y = positionOptions.y;
  this.origX = positionOptions.origX;
  this.origY = positionOptions.origY;

  this.locked = !!letter ? false : true;
  this.givenUp = false;

  this.faded = false;

  this.render = render;

  if (this.render) {
    this.sprite = this.game.add.sprite(this.x, this.y, this.color + 'Tile');

    this.text = this.game.add.text(this.x+gameConstants.TILE_SIZE.x/2,
      this.y+gameConstants.TILE_SIZE.y/2, this.letter, {
      fill: '#fff',
      align: 'center'
    });

    this.text.anchor.setTo(0.5);
  }
  this.text.font = 'Droid Sans Mono';

};

module.exports = Cell;

Cell.prototype.fade = function() {
  this.faded = true;
  if (this.render) this.sprite.loadTexture(this.color + 'Faded');
};

Cell.prototype.removeText = function() {
  // This removes the text for good.
  if (this.render) this.text.destroy();
};

Cell.prototype.removeSprite = function() {
  if (this.render) this.sprite.destroy();
}

Cell.prototype.drop = function(blocked) {
  if (!blocked[this.origY+1][this.origX]) {
    this.y += gameConstants.TILE_SIZE.y;
    this.origY++;
    if (this.render) {
      this.text.y += gameConstants.TILE_SIZE.y;
      this.sprite.y = this.y;
    }

    if (this.locked) {
      this.drop(blocked);
    }
  }
  else {
    return true;
  }
};

Cell.prototype.up = function() {
  this.y -= gameConstants.TILE_SIZE.y;
  this.origY--;

  if (this.render) {
    this.text.y -= gameConstants.TILE_SIZE.y;
    this.sprite.y = this.y;
  }

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
