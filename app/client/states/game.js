(function(){
'use strict';

var _             = require('lodash'),
    Typpo         = require('../typpo'),
    GameStatus    = require('../../common/game-status'),
    gameConstants = require('../../common/game-constants');


var Game = function() {
  this.countdownText = null;
  this.findingOppoentText = null;
  this.lastCount = null;
  this.lagBlocks = null;

  this.gameStatus = GameStatus.NOTLIVE;
  this.startCountDown = false;
  this.dots = 0;
  this.nextDot = 0;
  this.successCounter = 0;
  this.successTreshold = 5;
  this.countdown = 3;
  this.lagBlocks = [];

  exports.gameStatus = this.gameStatus;
};

Game.prototype.create = function() {
  this.game.socketHandler.findMatch(this);
  this.game.physics.startSystem(Phaser.Physics.Arcade);
  this.game.stage.backgroundColor = '#C8F7C5';

  this.countdownText = this.add.text(
    -999, // Temporary X (will be set)
    -999, // Temporary Y (will be set)
    '', // Text
    { // style
      font: '90pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );

  this.findingText = this.add.text(
    -999, // Temporary X (will be set)
    -999, // Temporary Y (will be set)
    'Finding opponent', // Text
    { // style
      font: '45pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );

  this.centerEntity(this.findingText, true, false);
  this.findingText.y = this.world.height/2 - 150;

  this.centerEntity(this.countdownText, true, true);

  this.loader = this.game.add.sprite(
    -999,
    this.world.height/2 + 75,
    'loadingAnimation'
  );

  this.centerEntity(this.loader, true, false);

  this.loader.animations.add('loop');
  this.loader.animations.play('loop', 15, true);

  this.lastCount = this.time.now;

  this.input.keyboard.addCallbacks(this, this.keyHandler);
};


Game.prototype.update = function() {
  if (this.startCountDown) {
    if (this.gameStatus === GameStatus.NOTLIVE) {
      this.countdownText.setText(String(this.countdown));
      this.countdownText.parent.bringToTop(this.countdownText);
      this.centerEntity(this.countdownText, true, true);

      if (this.countdown > 0) {
        if (this.time.elapsedSecondsSince(this.lastCount) > 1) {
          console.log(this.countdown);
          this.countdown--;
          this.lastCount = this.time.now;
        }
      }
    }
    else {
      if (this.gameStatus === GameStatus.LIVE) {
        this.player1.tick();
        this.player2.tick();
        this.fadeLagBlocks();
      }
      else {
        console.log('Game done.');
      }
    }
  }
  else {
    if (this.time.now > this.nextDot) {
      if (this.dots === 3) {
        this.dots = 0;
      }
      this.dots++;
      var dotString = '';
      for (var i = 0; i < this.dots; i++) {
        dotString += '.';
      }

      this.findingText.text = 'Finding opponent' + dotString;
      this.nextDot = this.time.now + 500;
    }
  }
};

Game.prototype.startCountdown = function(players, wordList) {
  this.findingText.destroy();
  this.loader.destroy();

  this.player1 = new Typpo(this, true, true, _.cloneDeep(wordList), {
    width: gameConstants.WIDTH,
    height: gameConstants.HEIGHT,
    positionX: gameConstants.TILE_SIZE.x,
    positionY: 0
  });

  this.player2 = new Typpo(this, true, false, _.cloneDeep(wordList), {
    width: gameConstants.WIDTH,
    height: gameConstants.HEIGHT,
    positionX: this.player1.getEndX() + gameConstants.TILE_SIZE.x,
    positionY: 0
  });

  this.startCountDown = true;
};

Game.prototype.startGame = function(startTime) {
  this.gameStatus = GameStatus.LIVE;
  this.player1.startGame(startTime);
  this.player2.startGame(startTime);
  this.countdownText.destroy();
};

Game.prototype.keyHandler = function(e) {
  if (this.gameStatus === GameStatus.LIVE) {
    var letter = String.fromCharCode(parseInt(e.keyIdentifier.slice(1), 16)).toLowerCase();
    if (/[a-z0-9]/.test(letter)) {
      // TODO: This will only work for English words, if the game should be translated this needs to be fixed

      if (this.player1.currentBlock === null) {
        _.some(this.player1.getAliveBlocks(), function(block) {
          if (letter === block.next.letter) {
            this.player1.fadeBlock(block);
            // Play good sound
            return true;
          }
        }, this);
      }
      else if (letter === this.player1.currentBlock.next.letter) {
        if (this.player1.fadeBlock()) {
          this.successCounter++;
          if (this.successCounter > this.successTreshold) {
            this.player2.greyCounter++;
            this.game.socketHandler.sendGrey();
            this.successCounter = 0;
          }
        }
      }
      else {
        this.successCounter = 0;
      }
    }

    else if (e.keyIdentifier === 'Enter') {
      this.player1.giveUpCurrentBlock();
      this.successCounter = 0;
    }
  }
};

Game.prototype.fadeLagBlocks = function() {
  // If the blocks don't exist at this exact moment the user is probably lagging behind or similar,
  // which means the blocks most likely will appear later on.

  _.forEach(this.lagBlocks, function(lagBlockID) {
    var lagBlock = _.find(this.player2.blocks, { 'id': lagBlockID });

    if (lagBlock !== undefined) {
      this.player2.fadeBlock(lagBlock);
      this.lagBlocks = _.without(this.lagBlocks, lagBlockID);
    }
  }, this);
};

Game.prototype.fadeBlock = function(blockID) {
  this.lagBlocks.push(blockID);
  this.fadeLagBlocks();
};

Game.prototype.gameDone = function(gameWon, emit) {
  if (gameWon) {
    this.gameStatus = GameStatus.WON;
  }
  else {
    this.gameStatus = GameStatus.LOST;
  }

  if (emit) {
    this.game.socketHandler.gameDone();
  }

  exports.gameStatus = this.gameStatus;
  this.game.state.start('Done');
};

Game.prototype.render = function() {
  if (false) {
    for (var i = 0; i < this.player1.blocks.length; i++) {
      for (var j = 0; j < this.player1.blocks[i].cells.length; j++) {
        this.game.debug.body(this.player1.blocks[i].cells[j].sprite);
      }
    }
  }
};

Game.prototype.addGrey = function() {
  this.player1.greyCounter++;
};

Game.prototype.centerEntity = function(entity, centerX, centerY) {
  if (centerX) {
    entity.x = this.world.width/2 - entity.width/2;
  }
  if (centerY) {
    entity.y = this.world.height/2 - entity.height/2;
  }
};

exports.constructor = Game;

})();


