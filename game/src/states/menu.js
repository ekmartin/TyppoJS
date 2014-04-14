'use strict';

var Menu   = function() {};

module.exports = Menu;

Menu.prototype = {
  preload: function() {
    // Menu
  },

  create: function() {
    this.game.state.start('Game');
  }
};
