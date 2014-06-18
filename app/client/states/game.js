(function(){
'use strict';

var _             = require('lodash'),
    Typpo         = require('../../common/typpo'),
    GameStatus    = require('../../common/game-status'),
    gameConstants = require('../../common/game-constants');


var Game = function() {
  this.countdownText = null;
  this.lastCount = null;
  this.lagBlocks = null;
  this.wordList = null;
  this.player1Nick = null;
  this.player2Nick = null;

  this.gameStatus = GameStatus.NOTLIVE;
  this.countdownStarted = false;
  this.successCounter = 0;
  this.successTreshold = 5;
  this.countdown = 3;
  this.lagBlocks = [];

  exports.gameStatus = this.gameStatus;
};

Game.prototype.create = function() {
  console.log('started game', Date.now()/1000);
  this.game.socketHandler.sendReady();

  this.stage.backgroundColor = '#C8F7C5';

  this.wordList = this.game.socketHandler.wordList;
  this.player1Nick = this.game.socketHandler.nickname;
  this.player2Nick = _.without(this.game.socketHandler.players, this.game.socketHandler.nickname)[0];

  this.waitingForPlayerGroup = this.add.group();

  this.waitingForPlayerText = this.add.text(
    this.world.centerX,
    this.world.centerY-100,
    'Waiting for your opponent',
    {
      font: '42pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    },
    this.waitingForPlayerGroup
  );
  this.waitingForPlayerText.anchor.setTo(0.5, 0.5);

  this.opponentNameText = this.add.text(
    this.world.centerX,
    this.world.centerY,
    this.player2Nick,
    {
      font: '42pt hallo_sansblack',
      fill: '#e74c3c',
      align: 'center'
    },
    this.waitingForPlayerGroup
  );
  this.opponentNameText.anchor.setTo(0.5, 0.5);

  this.loader = this.add.sprite(
    this.world.centerX,
    this.world.centerY + 130,
    'loadingAnimation',
    undefined,
    this.waitingForPlayerGroup
  );
  this.loader.anchor.setTo(0.5, 0.5);

  this.loader.animations.add('loop');
  this.loader.animations.play('loop', 15, true);

  this.countdownText = this.add.text(
    this.world.centerX,
    this.world.centerY,
    '', // Text
    { // style
      font: '90pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );
  this.countdownText.anchor.setTo(0.5, 0.5);

  this.input.keyboard.addCallbacks(this, this.keyHandler);
};


Game.prototype.update = function() {
  if (this.countdownStarted) {
    if (this.gameStatus === GameStatus.NOTLIVE) {
      this.countdownText.setText(String(this.countdown));
      this.countdownText.parent.bringToTop(this.countdownText);

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
};

Game.prototype.startCountdown = function() {
  this.player1 = new Typpo(this, true, true, _.cloneDeep(this.wordList), {
    width: gameConstants.WIDTH,
    height: gameConstants.HEIGHT,
    positionX: gameConstants.TILE_SIZE.x,
    positionY: 0
  });

  this.player2 = new Typpo(this, true, false, _.cloneDeep(this.wordList), {
    width: gameConstants.WIDTH,
    height: gameConstants.HEIGHT,
    positionX: this.player1.getEndX() + gameConstants.TILE_SIZE.x,
    positionY: 0
  });

  var player1Text = this.add.text(
    this.player1.x + this.player1.width/2,
    this.player1.y + this.player1.height + 25,
    this.player1Nick, // Text
    { // style
      font: '25pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );

  player1Text.anchor.setTo(0.5, 0.5);

  var player2Text = this.add.text(
    this.player2.x + this.player2.width/2,
    this.player2.y + this.player2.height + 25,
    this.player2Nick, // Text
    { // style
      font: '25pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );
  player2Text.anchor.setTo(0.5, 0.5);

  this.waitingForPlayerGroup.destroy();
  this.countdownStarted = true;
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
  var pre = this.lagBlocks;
  _.forEach(this.lagBlocks, function(lagBlockID, index) {
    if (lagBlockID === 'giveUp' && this.player2.currentBlock !== null) {
      this.player2.giveUpCurrentBlock();
      this.lagBlocks = _.without(this.lagBlocks, lagBlockID);
    }
    else {
      var lagBlock = _.find(this.player2.blocks, { 'id': lagBlockID });
      if (lagBlock !== undefined) {
        this.player2.fadeBlock(lagBlock);
        this.lagBlocks = _.without(this.lagBlocks, lagBlockID);
      }
    }
  }, this);
};

Game.prototype.fadeBlock = function(blockID) {
  this.lagBlocks.push(blockID);
};

Game.prototype.giveUpCurrentBlock = function() {
  this.lagBlocks.push('giveUp');
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

Game.prototype.addGrey = function() {
  this.player1.greyCounter++;
};

exports.constructor = Game;

})();


