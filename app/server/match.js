'use strict';

var uuid        = require('node-uuid'),
    Game        = require('./game'),
    GameStatus  = require('../common/game-status'),
    _           = require('lodash');

var Match = function(io, wordList, players) {
  this.id = uuid.v4();
  this.io = io;

  this.active = true;

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
    if (this.active) {
      this.io.to(this.id).emit('startMatch');
      this.game = new Game(this, this.wordList);
    }
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
  this.active = false;
  if (this.game) this.game.endGame();
  _.forEach(this.players, function(player) {
    player.leaveMatch();
  }, this);
};

Match.prototype.playerLost = function(playerID) {
  var player = _.find(this.players, { uuid: playerID });
  player.socket.emit('gameDone', GameStatus.LOST);
  player.socket.broadcast.to(this.id).emit('gameDone', GameStatus.WON);
};

Match.prototype.attachListeners = function() {
  _.forEach(this.players, function(player) {
    var socket = player.socket;

    socket.on('giveUpCurrentBlock', function() {
      this.game.giveUpCurrentBlock(player.uuid);
      socket.broadcast.to(this.id).emit('giveUpCurrentBlock');
    }.bind(this));

    socket.on('fadeBlock', function(blockID) {
      this.game.fadeBlock(player.uuid, blockID);
      socket.broadcast.to(this.id).emit('fadeBlock', blockID);
    }.bind(this));

    socket.on('greyBlock', function() {
      this.game.greyBlock(player.uuid);
      socket.broadcast.to(this.id).emit('greyBlock');
    }.bind(this));

    socket.on('gameDone', function() {
      var emitStatus = GameStatus.WON;
      socket.broadcast.to(this.id).emit('gameDone', emitStatus);
      this.matchDone();
    }.bind(this));

  }, this);
};

module.exports = Match;
