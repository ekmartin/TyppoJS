(function(){
'use strict';

var Menu            = function() {};
module.exports = Menu;

Menu.prototype = {
  create: function() {
    this.stage.backgroundColor = '#1abc9c';

    this.logo = this.add.image(this.world.centerX, 150, 'logo');
    this.logo.anchor.setTo(0.5, 0.5);

    this.findGameButton = this.add.button(this.world.centerX, 300, 'findGame', this.findGame, this, 1, 0, 0);
    this.privateMatchButton = this.add.button(this.world.centerX, 450, 'privateMatch', this.privateMatch, this, 1, 0, 0);
    this.findGameButton.anchor.setTo(0.5, 0.5);
    this.privateMatchButton.anchor.setTo(0.5, 0.5);
  },

  findGame: function() {
    this.game.state.start('PublicMatch');
  },

};

})();
