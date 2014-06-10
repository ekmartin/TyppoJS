(function(){
'use strict';

var SocketHandler = function(socket, nickname) {
  this.socket = socket;
  this.nickname = null;
  this.connected = false;

  this.game = null;

  this.socket.emit('hello', nickname);
  this.socket.on('helloDone', (function() {
    this.connected = true;
    this.nickname = nickname;
  }).bind(this));
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
  this.socket.on('foundMatch', (function(data) {
    this.attachGameListeners();
    this.game.startCountdown(data.players, data.wordList);
  }).bind(this));
};

// Tells the server the player lost.
SocketHandler.prototype.gameDone = function() {
  console.log('emitting gamedone.');
  this.socket.emit('gameDone');
};

SocketHandler.prototype.attachGameListeners = function() {
  this.socket.on('startMatch', function() {
    console.log("got start now", this.game.time.now);
    this.game.startGame();
  }.bind(this));

  this.socket.on('fadeBlock', function(blockID) {
    console.log("got a fadeblock :)", blockID);
    this.game.fadeBlock(blockID);
  }.bind(this));

  this.socket.on('opponentLeft', function() {
    console.log('opponent left.', this);
    this.game.gameDone(true);
  }.bind(this));

  this.socket.on('gameDone', function(emitStatus) {
    console.log('game done..');
    this.game.gameDone(true, false);
  }.bind(this));

}

module.exports = SocketHandler;

}());
