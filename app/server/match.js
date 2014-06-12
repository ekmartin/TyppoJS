'use strict';

var uuid        = require('node-uuid'),
    GameStatus  = require('../common/game-status'),
    _           = require('lodash');

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
    this.matchDone();
  }
};

Match.prototype.matchDone = function() {
  _.forEach(this.players, function(player) {
    player.leaveMatch();
  }, this);
};

Match.prototype.attachListeners = function() {
  _.forEach(this.players, function(player) {
    var socket = player.socket;

    socket.on('fadeBlock', function(blockID) {
      socket.broadcast.to(this.id).emit('fadeBlock', blockID);
    }.bind(this));

    socket.on('greyBlock', function() {
      console.log('sending grey');
      socket.broadcast.to(this.id).emit('greyBlock');
    }.bind(this));

    socket.on('gameDone', function() {
      var emitStatus = GameStatus.WON;
      /*

      // Players only emit when they lose, so this isn't necessary.
      switch(gameStatus) {
        case GameStatus.LOST:
          emitStatus = GameStatus.WON;
          break;
        case GameStatus.WON:
          emitStatus = GameStatus.LOST;
          break;
        default:
          throw new Error('gameStatus needs to be won/lost, not ' + gameStatus);
      }*/
      console.log('telling the other player that he won.');
      socket.broadcast.to(this.id).emit('gameDone', emitStatus);
      this.matchDone();
    }.bind(this));

  }, this);
};

module.exports = Match;
