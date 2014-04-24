'use strict';

var uuid = require('node-uuid');

var Player = function(client, nickname) {
  this.client = client;
  this.nickname = nickname;
  this.uuid = uuid.v4();

  this.match = null;
};

Player.prototype.setMatch = function(match) {
  this.match = match;
};

Player.prototype.leaveMatch = function() {
  this.match = null;
};

module.exports = Player;
