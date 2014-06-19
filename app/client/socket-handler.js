(function(){
'use strict';

var GameStatus = require('../common/game-status');

var SocketHandler = function(socket, nickname, state) {
  this.socket = socket;
  this.nickname = null;
  this.connected = false;

  this.state = state;
  this.game = state.states.Game;
  this.privateMatch = state.states.PrivateMatch;

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

SocketHandler.prototype.startPrivateMatch = function() {
  this.socket.emit('startPrivateMatch');
  this.socket.on('matchID', function(matchID) {
    this.privateMatch.setLink(matchID);
  }.bind(this));
  this.attachFoundMatch();
};

SocketHandler.prototype.joinPrivateMatch = function() {
  var matchID = window.location.hash.slice(1);
  this.socket.emit('joinPrivateMatch', matchID);
  this.attachIllegalMatchID();
  this.attachFoundMatch();
};

SocketHandler.prototype.findMatch = function() {
  this.socket.emit('findMatch');
  this.attachFoundMatch();
};

SocketHandler.prototype.attachIllegalMatchID= function() {
  this.socket.on('illegalMatchID', function() {
    window.location.hash = '';
    this.state.start('Menu');
  }.bind(this));
};

SocketHandler.prototype.attachFoundMatch = function() {
  this.socket.on('foundMatch', function(data) {
    this.players = data.players;
    this.wordList = data.wordList;
    console.log('the list', this.wordList);
    this.attachGameListeners();
    this.state.start('Game');
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

SocketHandler.prototype.sendReady = function() {
  console.log('sending ready', Date.now()/1000);
  this.socket.emit('ready', Date.now()/1000);
};

SocketHandler.prototype.attachGameListeners = function() {
  this.socket.on('startCountdown', function() {
    console.log('got startcountdown', Date.now()/1000);
    this.game.startCountdown();
  }.bind(this));

  this.socket.on('startMatch', function() {
    console.log('got startmatch', Date.now()/1000);
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
