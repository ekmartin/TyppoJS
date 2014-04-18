'use strict';

var Block = require('./block')
  , game  = require('../states/game').game;


var Typpo = function (width, height, positionX, positionY) {
  if (positionX + width*game.tileSize.x < game.game.width && positionY + height*game.tileSize.y < game.game.height) {
    this.width = width;
    this.height = height;
    this.realWidth = width*game.tileSize.x;
    this.realHeight = height*game.tileSize.y;
    this.x = positionX;
    this.y = positionY;

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

    this.testWord = {
      wordString: 'test',
      color: 'blue',
      x: (5*game.tileSize.x)+this.x
    };

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

Typpo.prototype.dropBlocks = function() {
  this.aliveBlocks.forEach(function(block) {
    // TODO: Add locked/grey check.
    block.drop();
  }, this);

  if (this.dropCounter >= this.dropTreshold) {
    this.addBlock(this.testWord);
    this.dropCounter = 0;
  }
  else {
    this.dropCounter++;
  }
};

Typpo.prototype.addBlock = function(word) {
  if (word.wordString !== undefined) {
    console.log(this.x, this.width);
    word.x = game.rnd.integerInRange(this.x+1, this.width-5);
    var block = new Block(word);
    this.blocks.push(block);
    this.aliveBlocks.push(block);
    this.blockGroup.add(block.cellGroup);
  }
  else {
    throw 'Word ' + word + ' does not have a wordString.';
  }
};

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
  this.aliveBlocks.splice(this.aliveBlocks.indexOf(block), 1);
  this.deadBlocks.push(block);
  block.lock();
};

Typpo.prototype.tick = function() {
  if (game.time.now > this.nextDrop) {
    this.collideCheck();
    this.dropBlocks();
    this.nextDrop = game.time.now + this.dropRate;
  }
};

module.exports = Typpo;
