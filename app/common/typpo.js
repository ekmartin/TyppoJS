(function(){
'use strict';

var Block         = require('./block'),
    _             = require('lodash'),
    gameConstants = require('../common/game-constants');


var blockedToString = function(blocked) {
  var returnString = "";

  _.forEach(blocked, function(row) {
    _.forEach(row, function(spot) {
      switch(spot) {
        case true:
          returnString += '| # ';
          break;
        case false:
          returnString += '|   ';
          break;
      }
    });
    returnString += '\n';
  });

  return returnString;
};


var Typpo = function (game, render, isPlayer, wordList, measures, playerID) {
  if (playerID) {
    this.playerID = playerID;
  }

  this.game = game;

  this.isPlayer = isPlayer;
  this.render = render;

  this.isDone = false;

  this.origWidth = measures.width;
  this.origHeight = measures.height;
  this.width = this.origWidth*gameConstants.TILE_SIZE.x;
  this.height = this.origHeight*gameConstants.TILE_SIZE.y;
  this.x = measures.positionX;
  this.y = measures.positionY;

  this.wordList = wordList;
  this.wordIndex = 0;

  this.nextDrop = 0;

  this.dropTreshold = 3;
  this.dropCounter = this.dropTreshold;

  this.greyCounter = 0;
  this.greyY = this.origHeight - gameConstants.BOTTOM_WALL -1;
  this.blocks = [];

  this.startTime = Date.now();

  this.currentBlock = null;

  this.lastTick = null;

  if (this.render) {
    this.walls  = this.game.add.group(this.game.world, 'walls', false);

    var blocked = this.getBlockedArray();

    console.log('blocked1', blocked);
    _.forEach(blocked, function(row, y) {
      _.forEach(row, function(cell, x) {
        if (cell) {
          this.walls.create(x*gameConstants.TILE_SIZE.x + this.x, y*gameConstants.TILE_SIZE.y + this.y, 'wallTile');
        }
        else {
          this.game.add.sprite(x*gameConstants.TILE_SIZE.x + this.x, y*gameConstants.TILE_SIZE.y + this.y, 'bgTile');
        }
      }, this);
    }, this);
  }
};


Typpo.prototype.getEndX = function() {
  return this.x + this.width;
};

Typpo.prototype.dropTick = function() {
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

  if (!this.render && gameConstants.DEBUG) {
    console.log(blockedToString(this.getBlockedArray()));
  }
};

Typpo.prototype.addBlock = function(wordObject) {
  if (wordObject.word !== undefined) {
    var blocked = this.getBlockedArray();

    for (var i = wordObject.x, l = wordObject.word.length; i < l; i++) {
      if (blocked[0][i]) {
        this.isDone = true;
        // Only care if the player loses, not the one he's spectating.
        if (this.isPlayer) this.game.gameDone(false, true, this.playerID);
        break;
      }
    }
    if (!this.isDone) {
      var x = gameConstants.TILE_SIZE.x*wordObject.x + this.x;
      var block = new Block(this.game, this.render, false, wordObject, x, 0);
      this.blocks.push(block);
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

    var totalDelta = now - this.startTime;

    if (now > this.nextDrop) {
      var delta = now - this.lastTick;

      this.dropRate = gameConstants.getDropRate(totalDelta/1000);

      var n = Math.floor(delta/this.dropRate);

      for (var i = 0; i < n; i++) {
        this.dropTick();
      }
      this.lastTick = now;
      this.nextDrop = now + this.dropRate;
    }
  }
};

/*

// Shouldn't the already completed letters be removed when the word collides?
// If so use this.
Typpo.prototype.cancelCurrentBlock = function() {
  this.currentBlock.cells.forEach(function(cell) {
    cell.unFade();
  }, this);
  this.currentBlock = null;
};*/

Typpo.prototype.giveUpCurrentBlock = function() {
  if (this.currentBlock !== null) {
    this.currentBlock.giveUp();
    this.currentBlock = null;

    this.emitEvent('giveUpCurrentBlock');
  }
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
  if (this.isPlayer && this.render) {
    console.log("Emitting", event, data);
    var socket = this.game.game.socketHandler.socket;
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
    this.game.gameDone(false, true, this.playerID);
  }
};

Typpo.prototype.addGrey = function() {
  var blockObject = {
    x: gameConstants.LEFT_WALL,
    y: this.greyY
  };

  this.upBlocks();

  var block = new Block(this.game, this.render, true, blockObject, this.x, this.y+(this.greyY*gameConstants.TILE_SIZE.y));

  this.blocks.push(block);
  this.greyY--;
};

module.exports = Typpo;
}());
