'use strict';

var uuid = require('node-uuid'),
    _    = require('lodash');

var Match = function(io, wordList, players) {
  this.id = uuid.v4();
  this.io = io;

  this.wordList = wordList.getWords(1000);
  this.players = players;

  _.forEach(this.players, function(player) {
    player.setMatch(this);
    player.socket.join(this.id);
  }, this);

  this.playerNicks = this.players.map(function(player) {
    return player.nickname;
  });

  this.io.to(this.id).emit('foundMatch', {
    players: this.playerNicks,
    wordList: this.wordList
  });

  setTimeout(function() {
    console.log("called start")
    this.io.to(this.id).emit('startMatch');
  }.bind(this), 3000);

  this.attachListeners();
};

Match.prototype.disconnected = function(player) {
  var others = _.without(this.players, player);
  // Just to make it possible to have multiple players in the future.
  // Should probably also mark the player as dead somehow.
  if (others.length === 1) {
    others[0].socket.emit('opponentLeft');
    _.forEach(this.players, function(player) {
      player.leaveMatch();
    });
  }
};

Match.prototype.attachListeners = function() {
  _.forEach(this.players, function(player) {
    var socket = player.socket;

    socket.on('fadeBlock', function(blockID) {
      console.log('Fading block.', blockID);
      socket.broadcast.to(this.id).emit('fadeBlock', blockID);
    }.bind(this));

    socket.on('sendGray', function() {
      socket.broadcast.to(this.id).emit('sendGray');
    }.bind(this));

    socket.on('lost', function() {
      // TODO: Need to say which player.
      socket.broadcast.to(this.id).emit('playerOut');
    }.bind(this));
  }, this);
};

module.exports = Match;
