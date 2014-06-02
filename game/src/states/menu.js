'use strict';

var Menu            = function() {}
  , SocketHandler   = require('../game/socket-handler');

module.exports = Menu;

Menu.prototype = {
  create: function() {
    this.game.socketHandler = new SocketHandler(this.game.socket, 'temp' + this.rnd.integerInRange(0, 9999));
  },

  update: function() {
    if (this.game.socketHandler.connected && this.game.socketHandler.nickname !== null) {
      this.game.state.start('Game');
    }
    else {
      console.log(this.game.socketHandler.connected, this.game.socketHandler.nickname);
    }
  }
};
