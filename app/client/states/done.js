(function(){
'use strict';

var Done        = function() {},
    GameStatus  = require('../../common/game-status');

module.exports = Done;

function GameStatusException(message) {
  this.message = message;
  this.name = 'GameStatusException';
}

Done.prototype = {

  create: function() {
    window.location.hash = '';

    this.stage.backgroundColor = '#C8F7C5';

    this.doneText = this.add.text(-999, 200, '', {
      font: '45pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    });

    var gameStatus = require('./game').gameStatus;

    switch (gameStatus) {
      case GameStatus.WON:
        this.doneText.setText(GameStatus.WON);
        this.doneText.x = this.world.width/2 - this.doneText.width/2;
        break;
      case GameStatus.LOST:
        this.doneText.setText(GameStatus.LOST);
        this.doneText.x = this.world.width/2 - this.doneText.width/2;
        break;
      default:
        throw new GameStatusException('Invalid GameStatus (not WON/LOST).');
    }

    this.menuButton = this.add.button(this.world.centerX, 350, 'menuButton', this.startMenu, this, 1, 0, 0);
    this.menuButton.anchor.setTo(0.5, 0.5);
  },

  startMenu: function() {
    this.game.state.start('Menu');
  }
};
})();
