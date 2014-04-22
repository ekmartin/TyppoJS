'use strict';

var Menu   = function() {};

module.exports = Menu;

Menu.prototype = {
  create: function() {
    this.game.state.start('Game');
  }
};
