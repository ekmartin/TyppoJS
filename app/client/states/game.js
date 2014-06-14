(function(){
'use strict';

var _             = require('lodash'),
    Typpo         = require('../../common/typpo'),
    GameStatus    = require('../../common/game-status'),
    gameConstants = require('../../common/game-constants');


var Game = function() {
  this.findingText = null;
  this.countdownText = null;
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

  this.findingText = this.add.text(
    this.world.centerX,
    this.world.centerY - 150,
    'Finding opponent',
    {
      font: '45pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );
  this.findingText.x = this.world.width/2 - this.findingText.width/2;

  this.hintText = this.add.text(
    this.world.centerX,
    this.world.centerY+250,
    'Hint: Write the words \non the falling blocks!',
    {
      font: '30pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );
  this.hintText.anchor.setTo(0.5, 0.5);

  this.loader = this.game.add.sprite(
    this.world.centerX,
    this.world.centerY + 75,
    'loadingAnimation'
  );
  this.loader.anchor.setTo(0.5, 0.5);

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
  this.hintText.destroy();
  this.findingText.destroy();
  this.loader.destroy();

  console.log('her', players);
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

  var player1Text = this.add.text(
    this.player1.x + this.player1.width/2,
    this.player1.y + this.player1.height + 25,
    players[0], // Text
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
    players[1], // Text
    { // style
      font: '25pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );
  player2Text.anchor.setTo(0.5, 0.5);

  this.startCountDown = true;
};

Game.prototype.startGame = function(startTime) {
  console.log('starting now!', startTime);
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


