'use strict';

var Menu            = function() {}
  , SocketHandler   = require('../game/socket-handler');

module.exports = Menu;

Menu.prototype = {
  create: function() {
    this.game.stage.backgroundColor = '#1abc9c';

    var logoWidth = 278;
    var buttonWidth = 594;

    this.logo = this.add.image(this.world.width/2-logoWidth/2, 150, 'logo');

    this.findGameButton = this.add.button(this.world.width/2-buttonWidth/2, 300, 'findGame', this.findGame, this, 1, 0, 0);
    this.privateMatchbutton = this.add.button(this.world.width/2-buttonWidth/2, 450, 'privateMatch', this.privateMatch, this, 1, 0, 0);

    this.game.socketHandler = new SocketHandler(this.game.socket, 'temp' + this.rnd.integerInRange(0, 9999));
  },

  findGame: function() {
    this.game.state.start('Game');
  },

};
