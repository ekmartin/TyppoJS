'use strict';

var Match = function(player1, player2) {
  // Should maybe use host/client principle instead of this p2p similiar stuff.

  this.player1 = player1;
  this.player2 = player2;

  this.player1.emit('matchfound');
  this.player2.emit('matchfound');

  this.player1.on('fadeBlock', function(block) {
    this.player2.emit('fadeBlock', { block: block });
  });

  this.player2.on('fadeBlock', function(block) {
    this.player1.emit('fadeBlock', { block: block });
  });

  this.player1.on('sendGray', function() {
    this.player2.emit('sendGray');
  });

  this.player2.on('sendGray', function() {
    this.player1.emit('sendGray');
  });

  this.player1.on('lost', function() {
    this.player2.emit('won');
    this.deleteMatch();
  });

  this.player2.on('lost', function() {
    this.player1.emit('won');
    this.deleteMatch();
  });
};

Match.prototype.disconnection = function(player) {
  if (player === this.player1) {
    this.player2.emit('opponent-dc');
  }
  else {
    this.player1.emit('opponent-dc');
  }
};

Match.prototype.deleteMatch = function() {
  this.player1.leaveMatch();
  this.player2.leaveMatch();
};

module.exports = Match;
