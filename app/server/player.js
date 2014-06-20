'use strict';

var uuid = require('node-uuid');

var Player = function Player(socket, nickname) {
  this.socket = socket;
  this.nickname = nickname;
  this.uuid = uuid.v4();
  this.searching = false;
  this.waitingForPrivateMatch = false;

  this.match = null;
};

Player.prototype.setMatch = function(match) {
  this.match = match;
  this.ready = false;
  this.searching = false;
};

Player.prototype.leaveMatch = function() {
  this.match = null;
  this.searching = false;
};

module.exports = Player;
