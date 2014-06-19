(function(){
'use strict';

var _ = require('lodash');


var PrivateMatch = function() {
  this.waitingText = null;

  this.dots = 0;
  this.nextDot = 0;
};

PrivateMatch.prototype.create = function() {
  this.game.socketHandler.startPrivateMatch();
  this.game.stage.backgroundColor = '#C8F7C5';

  this.sendLinkText = this.add.text(
    this.world.centerX,
    this.world.centerY - 150,
    'Send this link to your opponent:',
    {
      font: '45pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );
  this.sendLinkText.anchor.setTo(0.5, 0.5);

  this.waitingText = this.add.text(
    -999,
    this.world.centerY+250,
    'Waiting for a player to join',
    {
      font: '30pt hallo_sansblack',
      fill: '#f1c40f',
      align: 'center'
    }
  );
  // Can't anchor it as it would move around when the dots are added to its string.
  this.waitingText.x = this.world.width/2 - this.waitingText.width/2;

  this.matchInput = document.querySelector('#match-input');
  this.matchInput.style.display = 'inline';
  this.matchInput.focus();
};

PrivateMatch.prototype.setLink = function(matchID) {
  window.location.hash = matchID;
  this.matchInput.value = window.location.href;
};

PrivateMatch.prototype.update = function() {
  if (this.time.now > this.nextDot) {
    if (this.dots === 3) {
      this.dots = 0;
    }
    this.dots++;
    var dotString = '';
    for (var i = 0; i < this.dots; i++) {
      dotString += '.';
    }

    this.waitingText.setText('Waiting for a player to join' + dotString);
    this.nextDot = this.time.now + 500;
  }
};

PrivateMatch.prototype.shutdown = function() {
  this.matchInput.style.display = 'none';
};

module.exports = PrivateMatch;

})();


