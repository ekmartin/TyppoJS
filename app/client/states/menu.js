(function(){
'use strict';

var Menu            = function() {};
module.exports = Menu;

Menu.prototype = {
  create: function() {
    this.game.stage.backgroundColor = '#1abc9c';

    var logoWidth = 278;
    var buttonWidth = 594;

    this.logo = this.add.image(this.world.width/2-logoWidth/2, 150, 'logo');

    this.findGameButton = this.add.button(this.world.width/2-buttonWidth/2, 300, 'findGame', this.findGame, this, 1, 0, 0);
    this.privateMatchbutton = this.add.button(this.world.width/2-buttonWidth/2, 450, 'privateMatch', this.privateMatch, this, 1, 0, 0);
  },

  findGame: function() {
    this.game.state.start('Connect');
  },

};

})();
