(function(){
'use strict';

var _ = require('lodash');


var Game = function() {
  this.blockFontStyle = {
    font: '32px Consolas',
    fill: '#fff'
  };

  this.tileSize = {
    x: 32,
    y: 32
  };
};

Game.prototype.startGame = function(players, wordList) {
  var test = wordList.slice();
  test[0].x = 500;

  // :(
  exports.game = this;

  var Typpo = require('../game/typpo');

  this.player1 = new Typpo(true, _.cloneDeep(wordList), {
    width: 15,
    height: 20,
    positionX: 0,
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

Game.prototype.keyHandler = function(e) {
  if (this.hasStarted) {
    var letter = String.fromCharCode(parseInt(e.keyIdentifier.slice(1), 16)).toLowerCase();
    if (/[a-z0-9]/.test(letter)) {
      // TODO: This will only work for English words, if the game should be translated this needs to be fixed
      if (this.player1.currentBlock === null) {
        for (var i = 0, l = this.player1.aliveBlocks.length; i < l; i++) {
          if (letter === this.player1.aliveBlocks[i].next.letter) {
            this.player1.fadeBlock(this.player1.aliveBlocks[i]);
            // Play good sound
            break;
          }
        }
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
  this.game.socketHandler.findMatch(this);
  this.game.physics.startSystem(Phaser.Physics.Arcade);
  this.stage.backgroundColor = '#fff';

  this.hasStarted = false;
  this.startCountDown = false;
  this.countdown = 3;
  this.countdownText = this.add.text(this.world.width/2, this.world.height/2, String(this.countdown));
  this.lastCount = this.time.now;

  this.input.keyboard.addCallbacks(this, this.keyHandler);
};

Game.prototype.fadeBlock = function(blockID) {
  console.log("fading block with id", blockID, "found block", _.find(this.player2.blocks, { 'id': blockID }));
  this.player2.fadeBlock(_.find(this.player2.blocks, { 'id': blockID }));
};

Game.prototype.update = function() {
  if (this.startCountDown) {
    if (!this.hasStarted) {
      this.countdownText.setText(String(this.countdown));
      if (this.countdown > 0) {
        if (this.time.elapsedSecondsSince(this.lastCount) > 1) {
          console.log(this.countdown);
          this.countdown--;
          this.lastCount = this.time.now;
        }
      }
      else {
        this.countdownText.destroy();
        this.hasStarted = true;
      }
    }
    else {
      this.player1.tick();
      this.player2.tick();
    }
  }
};

exports.constructor = Game;

})();


