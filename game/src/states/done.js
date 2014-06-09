(function(){
'use strict';

var Done = function() {},
    GameStatus  = require('../game/game-status');

module.exports = Done;

function GameStatusException(message) {
  this.message = message;
  this.name = 'GameStatusException';
}

Done.prototype = {

  create: function() {

    this.doneText = this.add.text(this.world.width/2, 200, '', {
      font: '30pt Droid Sans Mono',
      fill: '#e67e22'
    });



    var game = require('./game').game;

    // Another magic number, centering text is a bitch - TODO.
    var centeringNumber = 28;

    switch (GameStatus.LOST) {
      case GameStatus.WON:
        this.doneText.setText(GameStatus.WON);
        this.doneText.x = this.world.width/2 - GameStatus.WON.length*28/2;
        break;
      case GameStatus.LOST:
        this.doneText.setText(GameStatus.LOST);
        this.doneText.x = this.world.width/2 - GameStatus.WON.length*28/2;
        break;
      default:
        throw new GameStatusException('Invalid GameStatus (not WON/LOST).');
    }

    var buttonWidth = 297;
    this.menuButton = this.add.button(this.world.width/2-buttonWidth/2, 300, 'menuButton', this.menuButton, this, 1, 0, 0);
  },

  menuButton: function() {
    this.game.state.start('Menu');
  }
};
})();
