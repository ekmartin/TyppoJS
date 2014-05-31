'use strict';

var uuid = require('node-uuid'),
    _    = require('lodash');

var Match = function(io, players) {
  // Should maybe use host/client principle instead of this p2p similiar stuff.

  this.id = uuid.v4();
  this.io = io;

  _.forEach(players, function(player) {
    player.client.join(this.id);
  }, this);

  this.playerNicks = players.map(function(player) {
    return player.nickname;
  });

  this.io.to(this.id).emit('foundMatch', this.playerNicks);

  this.attachListeners();
}


Match.prototype.attachListeners = function() {
  this.io.on('ready', function() {
    this.io.to(this.id).emit('start');
  });

  this.io.on('fadeBlock', function(block) {
    this.io.to(this.id).broadcast('fadeBlock', {
      block: block
    });
  });

  this.io.on('sendGray', function() {
    this.io.to(this.id).broadcast('sendGray');
  });

  this.io.on('lost', function() {
    // TODO: Need to say which player.
    this.io.to(this.id).broadcast('playerOut');
  });
}

module.exports = Match;
