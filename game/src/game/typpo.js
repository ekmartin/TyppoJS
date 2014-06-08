(function(){
'use strict';

var Block = require('./block'),
    game  = require('../states/game').game,
    _     = require('lodash');

function checkMeasures(game, measures) {
  return measures.positionX + measures.width*game.tileSize.x <= game.game.width &&
    measures.positionY + measures.height*game.tileSize.y <= game.game.height;
}

var Typpo = function (isPlayer, wordList, measures) {
  if (checkMeasures(game, measures)) {

    this.isPlayer = isPlayer;

    this.width = measures.width;
    this.height = measures.height;
    this.realWidth = this.width*game.tileSize.x;
    this.realHeight = this.height*game.tileSize.y;
    this.x = measures.positionX;
    this.y = measures.positionY;

    this.wordList = wordList;
    this.wordIndex = 0;

    this.nextDrop = 0;

    this.walls  = game.add.group(game.world, 'walls', false, true, Phaser.Physics.arcade);
    this.background = game.add.group();
    this.blockGroup = game.add.group();

    this.dropTreshold = 4;
    this.dropCounter = this.dropTreshold;
    this.dropRate = 1000;

    this.blocks = [];
    this.aliveBlocks = [];
    this.deadBlocks = [];

    this.currentBlock = null;

    this.lastTick = null;

    for (var x = 0; x < this.width; x += 1) {
      for (var y = 0; y < this.height; y += 1) {
        if (x === 0 || x === (this.width-1) || y === (this.height-1)) {
          var wall = this.walls.create(x*game.tileSize.x + this.x, y*game.tileSize.y + this.y, 'wallTile');
          wall.body.immovable = true;
          // TODO: Fix this hacky solution:
          wall.body.setSize(wall.body.width, wall.body.height+1, 0, -1);
        }
        else {
          this.background.create(x*game.tileSize.x + this.x, y*game.tileSize.y + this.y, 'bgTile');
        }
      }
    }
  }
  else {
    throw 'Typpo goes outside the game width.';
  }
};


Typpo.prototype.getEndX = function() {
  return this.x + this.realWidth;
};

Typpo.prototype.dropTick = function() {
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
    var blocked = this.getBlockedArray();
    var lost = false;

    for (var i = wordObject.x, l = wordObject.word.length; i < l; i++) {
      if (blocked[0][i]) {
        lost = true;
        console.log('done');
        game.gameDone(false);
        break;
      }
    }
    if (!lost) {
      var x = game.tileSize.x*wordObject.x + this.x;
      var block = new Block(wordObject, x);
      this.blocks.push(block);
      this.aliveBlocks.push(block);

      this.blockGroup.add(block.cellGroup);
    }
  }
  else {
    throw 'WordObject ' + wordObject + ' does not have a word.';
  }
};

Typpo.prototype.getBlockedArray = function() {
  var blocked = [];

  for (var y = 0; y < this.height; y++) {
    var yArr = [];
    for (var x = 0; x < this.width; x++) {
      if (x === 0 || x === (this.width-1) || y === (this.height-1)) {
        yArr.push(true);
      }
      else yArr.push(false);
    }
    blocked.push(yArr);
  }

  _.forEach(this.blocks, function(block) {
    _.forEach(block.cells, function(cell) {
      blocked[cell.realY][cell.realX] = true;
    });
  });

  return blocked;
};

Typpo.prototype.dropBlocks = function() {
  var blocked = this.getBlockedArray();
  _.forEach(this.blocks, function(block) {
    block.drop(blocked);
  });
};

/*
Typpo.prototype.collideCheck = function() {
  // TODO: Would be better to just collide the block group itself, but not sure if it works with block nesting.
  if (this.aliveBlocks.length > 0) {
    this.aliveBlocks.forEach(function(aliveBlock) {
      var hitWall = false;
      var hitBlock = false;
      game.physics.arcade.overlap(aliveBlock.cellGroup, this.walls, function(aliveCell, wallCell) {
        aliveCell.crashed = true;
        hitWall = true;
      }, null, this);

      if (!hitWall) {
        this.deadBlocks.forEach(function(deadBlock) {
          if (aliveBlock !== deadBlock) {
            game.physics.arcade.overlap(aliveBlock.cellGroup, deadBlock.cellGroup, function(aliveCell, deadCell) {
              aliveCell.crashed = true;
              hitBlock = true;
            }, null, this);
            if (hitBlock) return false;
          }
        }, this);
      }
      if (hitWall || hitBlock) {
        this.collideBlock(aliveBlock, hitWall);
      }
    }, this);
  }
};

Typpo.prototype.collideBlock = function(block, hitWall) {
  var crashCallback = function(crashCell, crashObject) {
    crashCell.crashed = true;
  };

  if (!hitWall) {
    block.cells.forEach(function(cell) {
      while(cell.sprite.crashed !== true) {
        cell.drop();
        game.physics.arcade.overlap(cell.sprite, this.walls, crashCallback);
        for (var i = 0, l = this.blocks.length; i < l; i++) {
          if (this.blocks[i] !== block) {
            game.physics.arcade.overlap(cell.sprite, this.blocks[i].cellGroup, crashCallback);
          }
        }
      }
    }, this);
  }

  if (this.currentBlock === block) {
    this.cancelCurrentBlock();
  }
  this.aliveBlocks.splice(this.aliveBlocks.indexOf(block), 1);
  this.deadBlocks.push(block);
  block.lock();
};*/

Typpo.prototype.tick = function() {
  var now = game.time.now;

  if (now > this.nextDrop) {
    var delta = now - this.lastTick;
    var n = ~~(delta/this.dropRate); // Integer division (floored)
    console.log('dropping ', n);
    for (var i = 0; i < n; i++) {
      //this.collideCheck();
      this.dropTick();
    }
    this.lastTick = now;
    this.nextDrop = now + this.dropRate;
  }
};

Typpo.prototype.cancelCurrentBlock = function() {
  this.currentBlock.cells.forEach(function(cell) {
    cell.unFade();
  }, this);
  this.currentBlock = null;
};

Typpo.prototype.giveUpCurrentBlock = function() {
  //this.aliveBlocks.splice(this.aliveBlocks.indexOf(this.currentBlock), 1);
  this.currentBlock.giveUp();
  this.currentBlock = null;
};

Typpo.prototype.fadeBlock = function(block) {
  if (block === undefined) {
    if (this.currentBlock !== null) {
      block = this.currentBlock;
    }
    else throw 'Trying to fade current block before a block has been started on.';
  }

  console.log('fading block', block.id, block);
  this.emitEvent('fadeBlock', block.id);

  if (block.fadeNext()) {
    this.currentBlock = null;
    block.textGroup.destroy();
    block.cellGroup.destroy();
    this.blocks.splice(this.blocks.indexOf(block), 1);
    this.aliveBlocks.splice(this.aliveBlocks.indexOf(block), 1);
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

module.exports = Typpo;
}());
