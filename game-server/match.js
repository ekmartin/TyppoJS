'use strict';

var uuid = require('node-uuid'),
    _    = require('lodash');

var Match = function(io, wordList, players) {
  this.id = uuid.v4();
  this.io = io;

  this.wordList = wordList.getWords(1000);
  this.players = players;

  _.forEach(this.players, function(player) {
    player.socket.join(this.id);
  }, this);

  this.playerNicks = this.players.map(function(player) {
    return player.nickname;
  });

  this.io.to(this.id).emit('foundMatch', {
    players: this.playerNicks,
    wordList: this.wordList
  });

  this.attachListeners();
}


Match.prototype.attachListeners = function() {
  /*this.io.on('ready', function() {
    this.io.to(this.id).emit('start');
  });*/
  console.log('hooked', this.id);
  _.forEach(this.players, function(player) {
    var socket = player.socket;

    socket.on('fadeBlock', function(blockID) {
      console.log('Fading block.', this.id, this);
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
}

module.exports = Match;
