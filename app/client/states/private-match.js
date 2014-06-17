(function(){
'use strict';

var PrivateMatch        = function() {};

module.exports = PrivateMatch;

PrivateMatch.prototype = {

  create: function() {
    this.game.stage.backgroundColor = '#C8F7C5';

    this.PrivateMatchText = this.add.text(-999, 200, '', {
      font: '45pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    });

    this.menuButton = this.add.button(this.world.centerX, 350, 'menuButton', this.menuButton, this, 1, 0, 0);
    this.menuButton.anchor.setTo(0.5, 0.5);

  },

  menuButton: function() {
    this.game.state.start('Menu');
  }
};
})();
