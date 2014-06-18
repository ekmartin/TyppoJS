(function(){
'use strict';

var _ = require('lodash');


var PublicMatch = function() {
  this.findingText = null;

  this.dots = 0;
  this.nextDot = 0;
};

PublicMatch.prototype.create = function() {
  console.log('got here');
  this.game.socketHandler.findMatch();
  this.game.stage.backgroundColor = '#C8F7C5';

  this.findingText = this.add.text(
    this.world.centerX,
    this.world.centerY - 150,
    'Finding opponent',
    {
      font: '45pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );
  this.findingText.anchor.setTo(0.5, 0.5);

  this.hintText = this.add.text(
    this.world.centerX,
    this.world.centerY+250,
    'Hint: Write the words \non the falling blocks!',
    {
      font: '30pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );
  this.hintText.anchor.setTo(0.5, 0.5);

  this.loader = this.add.sprite(
    this.world.centerX,
    this.world.centerY + 75,
    'loadingAnimation'
  );
  this.loader.anchor.setTo(0.5, 0.5);

  this.loader.animations.add('loop');
  this.loader.animations.play('loop', 15, true);
};


PublicMatch.prototype.update = function() {
  if (this.time.now > this.nextDot) {
    if (this.dots === 3) {
      this.dots = 0;
    }
    this.dots++;
    var dotString = '';
    for (var i = 0; i < this.dots; i++) {
      dotString += '.';
    }

    this.findingText.text = 'Finding opponent' + dotString;
    this.nextDot = this.time.now + 500;
  }
};

module.exports = PublicMatch;

})();


