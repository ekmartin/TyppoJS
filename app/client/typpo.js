(function(){
'use strict';

var Block         = require('./block'),
    game          = require('./states/game').game,
    _             = require('lodash'),
    gameConstants = require('../common/game-constants');

function checkMeasures(game, measures) {
  return measures.positionX + measures.width*game.tileSize.x <= game.game.width &&
    measures.positionY + measures.height*game.tileSize.y <= game.game.height;
}

var Typpo = function (isPlayer, wordList, measures) {
  if (checkMeasures(game, measures)) {

    this.isPlayer = isPlayer;
    this.isDone = false;

    this.origWidth = measures.width;
    this.origHeight = measures.height;
    this.width = this.origWidth*game.tileSize.x;
    this.height = this.origHeight*game.tileSize.y;
    this.x = measures.positionX;
    this.y = measures.positionY;

    this.wordList = wordList;
    this.wordIndex = 0;

    this.nextDrop = 0;

    this.walls  = game.add.group(game.world, 'walls', false);
    this.background = game.add.group();
    this.blockGroup = game.add.group();

    this.dropTreshold = 3;
    this.dropCounter = this.dropTreshold;
    this.dropRate = 850;

    this.greyCounter = 0;
    this.greyY = this.origHeight - gameConstants.BOTTOM_WALL -1;
    this.blocks = [];

    this.currentBlock = null;

    this.lastTick = null;

    for (var x = 0; x < this.origWidth; x++) {
      for (var y = 0; y < this.origHeight; y++) {
        if (x === 0 || x === (this.origWidth-1) || y === (this.origHeight-1)) {
          var wall = this.walls.create(x*game.tileSize.x + this.x, y*game.tileSize.y + this.y, 'wallTile');
        }
        else {
          this.background.create(x*game.tileSize.x + this.x, y*game.tileSize.y + this.y, 'bgTile');
        }
      }
    }
  }
  else {
    throw new Error('Typpo goes outside the game width.');
  }
};


Typpo.prototype.getEndX = function() {
  return this.x + this.width;
};

Typpo.prototype.dropTick = function() {
  // Temporarily linear
  for(; this.greyCounter > 0; this.greyCounter--) {
    this.addGrey();
  }

  this.dropBlocks();

  if (this.dropCounter >= this.dropTreshold) {
    this.addBlock(this.wordList[this.wordIndex]);
    this.wordIndex += 1;
    this.dropCounter = 0;
  }
  else {
    this.dropCounter++;
  }
};

Typpo.prototype.addBlock = function(wordObject) {
  if (wordObject.word !== undefined) {

    if (this.dropRate > 400) {
      this.dropRate -= 7;
    }

    var blocked = this.getBlockedArray();

    for (var i = wordObject.x, l = wordObject.word.length; i < l; i++) {
      if (blocked[0][i]) {
        this.isDone = true;
        // Only care if the player loses, not the one he's spectating.
        if (this.isPlayer) game.gameDone(false, true);
        break;
      }
    }
    if (!this.isDone) {
      var x = game.tileSize.x*wordObject.x + this.x;
      var block = new Block(false, wordObject, x);
      this.blocks.push(block);

      this.blockGroup.add(block.cellGroup);
    }
  }
  else {
    throw new Error('WordObject ' + wordObject + ' does not have a word.');
  }
};

Typpo.prototype.getBlockedArray = function() {
  var blocked = [];

  for (var y = 0; y < this.origHeight; y++) {
    var yArr = [];
    for (var x = 0; x < this.origWidth; x++) {
      if (x === 0 || x === (this.origWidth-1) || y === (this.origHeight-1)) {
        yArr.push(true);
      }
      else yArr.push(false);
    }
    blocked.push(yArr);
  }

  _.forEach(this.blocks, function(block) {
    _.forEach(block.cells, function(cell) {
      blocked[cell.origY][cell.origX] = true;
    });
  });

  return blocked;
};

Typpo.prototype.getAliveBlocks = function() {
  var aliveBlocks = this.blocks.filter(function(block) {
    return !block.locked;
  }, this);
  return aliveBlocks;
};

Typpo.prototype.dropBlocks = function() {
  var blocked = this.getBlockedArray();
  _.forEach(this.blocks, function(block) {
    block.drop(blocked);
  });

  if (this.currentBlock !== null) {
    if (this.currentBlock.locked) {
      this.currentBlock = null;
    }
  }
};

Typpo.prototype.tick = function() {
  if (!this.isDone) {
    // Even Date seems more reliable than Phaser's time when the game loses focus.
    var now = Date.now();

    if (now > this.nextDrop) {
      var delta = now - this.lastTick;
      var n = ~~(delta/this.dropRate); // Integer division (floored)

      for (var i = 0; i < n; i++) {
        this.dropTick();
      }
      this.lastTick = now;
      this.nextDrop = now + this.dropRate;
    }
  }
};

/*

// Should the already completed letters be removed when the word collides?
// If so use this.
Typpo.prototype.cancelCurrentBlock = function() {
  this.currentBlock.cells.forEach(function(cell) {
    cell.unFade();
  }, this);
  this.currentBlock = null;
};*/

Typpo.prototype.giveUpCurrentBlock = function() {
  this.currentBlock.giveUp();
  this.currentBlock = null;
};

Typpo.prototype.fadeBlock = function(block) {
  if (block === undefined) {
    if (this.currentBlock !== null) {
      block = this.currentBlock;
    }
    else throw new Error('Trying to fade current block before a block has been started on.');
  }

  this.emitEvent('fadeBlock', block.id);

  if (block.fadeNext()) {
    this.currentBlock = null;
    this.blocks.splice(this.blocks.indexOf(block), 1);
    return true;
  }
  else {
    this.currentBlock = block;
    return false;
  }
};

Typpo.prototype.emitEvent = function(event, data) {
  if (this.isPlayer) {
    console.log("Emitting", event, data);
    var socket = game.game.socketHandler.socket;
    if (data !== undefined) {
      socket.emit(event, data);
    }
    else {
      socket.emit(event);
    }
  }
};

Typpo.prototype.startGame = function(startTime) {
  this.lastTick = startTime;
};

Typpo.prototype.upBlocks = function() {
  var gameOver = _.some(this.blocks, function(block) {
    if (block.locked && !block.isGrey) {
      return block.up();
    }
    return false;
  });
  if (gameOver && this.isPlayer) {
    game.gameDone(false, true);
  }
};

Typpo.prototype.addGrey = function() {
  var blockObject = {
    x: gameConstants.LEFT_WALL,
    y: this.greyY
  };

  this.upBlocks();

  var block = new Block(true, blockObject, this.x, this.y+(this.greyY*game.tileSize.y));

  this.blocks.push(block);
  this.blockGroup.add(block.cellGroup);
  this.greyY--;
};

module.exports = Typpo;
}());
