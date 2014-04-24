(function(){
'use strict';

var game;

var Game = function() {
  game = this;

  this.blockFontStyle = {
    font: '32px Consolas',
    fill: '#fff'
  };

  this.tileSize = {
    x: 32,
    y: 32
  };
};

module.exports = Game;

Game.prototype = {
  create: function() {
    // Might be a bit hacky? Might be a better way to do it, but TypeGame needs to know
    module.exports.game = this;
    this.Typpo = require('../game/typpo');

    this.game.physics.startSystem(Phaser.Physics.Arcade);
    this.player1 = new this.Typpo(15, 20, 0, 0);
    this.player2 = new this.Typpo(15, 20, this.player1.getEndX() + this.tileSize.x, 0);
    this.stage.backgroundColor = '#fff';

    this.hasStarted = false;
    this.countdown = 3;
    this.countdownText = this.add.text(this.world.width/2, this.world.height/2, String(this.countdown));
    this.lastCount = this.time.now;

    this.input.keyboard.addCallbacks(this, this.keyHandler);
  },

  update: function() {
    if (this.game.socketHandler.gotMatch) {
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
      }
    }
    else {
      console.log("looking for match");
    }
  },

  keyHandler: function(e) {
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

  },
};
})();

