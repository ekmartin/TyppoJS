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

  this.startedWriting = false;
  this.currentBlock = null;
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

    this.input.keyboard.addCallbacks(this, this.keyHandler);
  },

  update: function() {
    this.player1.tick();
  },

  keyHandler: function(e) {
    var letter = String.fromCharCode(parseInt(e.keyIdentifier.slice(1), 16)).toLowerCase();

    if (/[a-z]/.test(letter)) {
      // TODO: This will only work for English words, if the game should be translated this needs to be fixed
      console.log(this.startedWriting);
      if (!this.startedWriting) {
        for (var i = 0, l = this.player1.aliveBlocks.length; i < l; i++) {
          if (letter === this.player1.aliveBlocks[i].next.letter) {
            if (!this.player1.fadeBlock(this.player1.aliveBlocks[i])) {
              this.startedWriting = true;
              this.currentBlock = this.player1.aliveBlocks[i];
            }
          }
        }
      }
      else {
        console.log(this.currentBlock.next.letter);
        if (letter === this.currentBlock.next.letter) {
          if (this.player1.fadeBlock(this.currentBlock)) {
            this.startedWriting = false;
            this.currentBlock = null;
          }
        }
      }
    }

  },

  render: function() {
    /*
    if (this.player1.aliveBlocks.length > 0) {
      this.player1.walls.forEach(function(wall) {
        this.game.debug.body(wall);
      }, this);
      //this.game.debug.bodyInfo(this.player1.aliveBlocks[0].cellGroup.getAt(0), 20, 20);
      //this.game.debug.bodyInfo(this.player1.aliveBlocks[1].cellGroup.getAt(0), 20, 400);
      this.game.debug.body(this.player1.aliveBlocks[0].cellGroup.getAt(0));
    }
    */
  }
};
})();

