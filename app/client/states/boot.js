(function(){
'use strict';

var Boot = function() {};

module.exports = Boot;

Boot.prototype = {
  preload: function() {
    this.load.spritesheet('loadingAnimation', '/assets/img/loadingAnimation.png', 120, 128);
  },

  create: function() {
    this.game.stage.disableVisibilityChange = true;

    this.game.state.start('Preloader');
  }
};
})();
