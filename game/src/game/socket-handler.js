(function(){
'use strict';

var SocketHandler = function(socket, nickname) {
  this.socket = socket;
  this.nickname = null;
  this.connected = false;
  this.gotMatch = false;

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
    console.log("starter");
    this.attachGameListeners();
    this.game.startGame(data.players, data.wordList);
  }).bind(this));
};

SocketHandler.prototype.attachGameListeners = function() {
  console.log("attached?");
  this.socket.on('fadeBlock', function(blockID) {
    console.log("got a fadeblock :)", blockID);
    this.game.fadeBlock(blockID);
  }.bind(this));
}

module.exports = SocketHandler;

}());
