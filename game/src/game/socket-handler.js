(function(){
'use strict';

var SocketHandler = function(socket, nickname) {
  this.socket = socket;
  this.nickname = null;
  this.connected = false;
  this.gotMatch = false;

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

SocketHandler.prototype.findMatch = function() {
  this.socket.emit('findMatch');
  this.socket.on('foundMatch', (function() {
    console.log("FOUND A FUCKING MATCH");
    this.gotMatch = true;
  }).bind(this));
};

module.exports = SocketHandler;

}());
