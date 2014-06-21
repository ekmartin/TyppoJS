(function(){
'use strict';

var _ = require('lodash');


var PublicMatch = function() {
  this.findingText = null;

  this.dots = 0;
  this.nextDot = 0;
};

PublicMatch.prototype.create = function() {
  this.game.socketHandler.findMatch();
  this.game.stage.backgroundColor = '#C8F7C5';

  this.findingText = this.add.text(
    -999,
    this.world.centerY - 170,
    'Finding opponent',
    {
      font: '45pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    }
  );
  // Can't anchor it as it would move around when the dots are added to its string.
  this.findingText.x = this.world.width/2 - this.findingText.width/2;

  this.hintText = this.add.text(
    this.world.centerX,
    this.world.centerY+150,
    'Hint: Write the words \non the falling blocks!',
    {
      font: '30pt hallo_sansblack',
      fill: '#f1c40f',
      align: 'center'
    }
  );
  this.hintText.anchor.setTo(0.5, 0.5);

  this.loader = this.add.sprite(
    this.world.centerX,
    this.world.centerY,
    'loadingAnimation'
  );
  this.loader.anchor.setTo(0.5, 0.5);

  this.loader.animations.add('loop');
  this.loader.animations.play('loop', 15, true);

  this.smallMenuButton = this.add.button(this.world.centerX, this.world.centerY+280,
    'menuButton', this.startMenu, this, 1, 0, 0);
  this.smallMenuButton.scale.setTo(0.6, 0.6);
  this.smallMenuButton.anchor.setTo(0.5, 0.5);
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

PublicMatch.prototype.startMenu = function() {
  this.game.socketHandler.stopSearching();
  this.game.state.start('Menu');
};

module.exports = PublicMatch;

})();


