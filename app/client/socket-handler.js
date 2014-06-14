(function(){
'use strict';

var GameStatus = require('../common/game-status');

var SocketHandler = function(socket, nickname) {
  this.socket = socket;
  this.nickname = null;
  this.connected = false;

  this.game = null;

  if (this.socket.connected) {
    this.socket.emit('hello', nickname);
  }
  else {
    this.attachConnect(nickname);
  }

  this.socket.on('helloDone', function() {
    this.connected = true;
    this.nickname = nickname;
  }.bind(this));

  this.socket.on('disconnect', function(err) {
    console.log('Disconnected:', err);
    this.attachConnect(nickname);
  }.bind(this));
};

SocketHandler.prototype.attachConnect = function(nickname) {
  this.socket.on('connect', function() {
    console.log('got connect again emitting hello');
    this.socket.emit('hello', nickname);
  }.bind(this));
};

SocketHandler.prototype.setNickname = function(nickname) {
  this.socket.emit('setNick', nickname);
  this.socket.on('setNickDone', (function() {
    this.nickname = nickname;
  }).bind(this));
};

SocketHandler.prototype.findMatch = function(game) {
  this.game = game;
  this.socket.emit('findMatch');
  this.socket.on('foundMatch', function(data) {
    this.attachGameListeners();
    this.game.startCountdown(data.players, data.wordList);
  }.bind(this));
};

// Tells the server the player lost.
SocketHandler.prototype.gameDone = function() {
  console.log('emitting gamedone.');
  this.socket.emit('gameDone');
};

SocketHandler.prototype.sendGrey = function() {
  this.socket.emit('greyBlock');
};

SocketHandler.prototype.attachGameListeners = function() {
  this.socket.on('startMatch', function() {
    this.game.startGame(Date.now());
  }.bind(this));

  this.socket.on('fadeBlock', function(blockID) {
    this.game.fadeBlock(blockID);
  }.bind(this));

  this.socket.on('opponentLeft', function() {
    console.log('opponent left.', this);
    this.game.gameDone(true, false);
  }.bind(this));

  this.socket.on('gameDone', function(emitStatus) {
    console.log('game done..', emitStatus);
    switch(emitStatus) {
      case GameStatus.LOST:
        this.game.gameDone(false, false);
        break;
      case GameStatus.WON:
        this.game.gameDone(true, false);
        break;
      default:
        throw new Error('gameStatus needs to be won/lost, not ' + gameStatus);
    }
  }.bind(this));

  this.socket.on('greyBlock', function() {
    this.game.addGrey();
  }.bind(this));

  this.socket.on('giveUpCurrentBlock', function() {
    this.game.giveUpCurrentBlock();
  }.bind(this));
};

module.exports = SocketHandler;

}());
