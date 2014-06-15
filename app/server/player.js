'use strict';

var uuid = require('node-uuid');

var Player = function Player(socket, nickname) {
  this.socket = socket;
  this.nickname = nickname;
  this.uuid = uuid.v4();
  this.searching = false;

  this.match = null;
};

Player.prototype.setMatch = function(match) {
  this.match = match;
};

Player.prototype.leaveMatch = function() {
  this.match = null;
};

module.exports = Player;
