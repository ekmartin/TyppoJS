(function(){
'use strict';

var _           = require('lodash'),
    GameStatus  = require('../game/game-status');

var Game = function() {

  this.gameStatus = null;
  this.startCountDown = null;
  this.countdown = null;
  this.countdownText = null;
  this.lastCount = null;
  this.lagBlocks = null;

  this.tileSize = {
    x: 32,
    y: 32
  };
};

Game.prototype.startCountdown = function(players, wordList) {
  // :(
  exports.game = this;

  this.game.stage.backgroundColor = '#FFFFF0';
  var Typpo = require('../game/typpo');

  this.player1 = new Typpo(true, _.cloneDeep(wordList), {
    width: 15,
    height: 20,
    positionX: this.tileSize.x,
    positionY: 0
  });

  this.player2 = new Typpo(false, _.cloneDeep(wordList), {
    width: 15,
    height: 20,
    positionX: this.player1.getEndX() + this.tileSize.x,
    positionY: 0
  });
  this.startCountDown = true;
};

Game.prototype.startGame = function() {
  console.log("starting now", this.time.now);
  var startTime = this.time.now;
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
      console.log('curr', this.player1.currentBlock);
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
          // Word complete, play sound?
        }
      }
      else {
        // Play bad sound
      }
    }

    else if (e.keyIdentifier === 'Enter') {
      this.player1.giveUpCurrentBlock();
    }
  }
};

Game.prototype.create = function() {
  this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');

  this.game.socketHandler.findMatch(this);
  this.game.physics.startSystem(Phaser.Physics.Arcade);
  this.stage.backgroundColor = '#fff';

  this.gameStatus = GameStatus.NOTLIVE;
  this.startCountDown = false;
  this.countdown = 3;

  var fontSize = 70;
  this.countdownText = this.add.text(this.world.width/2-fontSize/2,
    this.world.height/2-3*this.tileSize.y,
    String(this.countdown));
  this.countdownText.fontSize = fontSize;
  this.countdownText.font = 'Droid Sans Mono';

  this.lastCount = this.time.now;
  this.lagBlocks = [];

  this.input.keyboard.addCallbacks(this, this.keyHandler);
};

Game.prototype.fadeLagBlocks = function() {
  // If the blocks don't exist at this exact moment the user is probably lagging behind or similar,
  // which means the blocks most likely will appear later on.

  _.forEach(this.lagBlocks, function(lagBlockID) {
    var lagBlock = _.find(this.player2.blocks, { 'id': lagBlockID });
    console.log('looping lagblocks found', lagBlock, ' from id', lagBlockID);
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

Game.prototype.update = function() {
  if (this.startCountDown) {
    if (this.gameStatus === GameStatus.NOTLIVE) {
      this.countdownText.setText(String(this.countdown));
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

Game.prototype.gameDone = function(gameWon) {
  if (gameWon) {
    this.gameStatus = GameStatus.WON;
  }
  else {
    this.gameStatus = GameStatus.LOST;
  }
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

exports.constructor = Game;

})();


