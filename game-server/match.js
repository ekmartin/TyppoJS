'use strict';

var Match = function(player1, player2) {
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

  this.player1.on('lost', )
};

module.exports = Match;
