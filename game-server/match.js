'use strict';

var Match = function(player1, player2) {
  // Should maybe use host/client principle instead of this p2p similiar stuff.

  this.player1 = player1;
  this.player2 = player2;

  this.players = [this.player1, this.player2];

  this.emitAll('foundmatch');

  this.player1.client.on('fadeBlock', function(block) {
    this.player2.client.emit('fadeBlock', { block: block });
  });

  this.player2.client.on('fadeBlock', function(block) {
    this.player1.client.emit('fadeBlock', { block: block });
  });

  this.player1.client.on('sendGray', function() {
    this.player2.client.emit('sendGray');
  });

  this.player2.client.on('sendGray', function() {
    this.player1.client.emit('sendGray');
  });

  this.player1.client.on('lost', function() {
    this.player2.client.emit('won');
    this.deleteMatch();
  });

  this.player2.client.on('lost', function() {
    this.player1.client.emit('won');
    this.deleteMatch();
  });
};

Match.prototype.emitAll = function(msg) {
  this.players.forEach(function(player) {
    player.client.emit(msg);
  });
};

Match.prototype.disconnection = function(player) {
  if (player === this.player1) {
    this.player2.client.emit('opponent-dc');
  }
  else {
    this.player1.client.emit('opponent-dc');
  }
};

Match.prototype.deleteMatch = function() {
  this.player1.leaveMatch();
  this.player2.leaveMatch();
};

module.exports = Match;
