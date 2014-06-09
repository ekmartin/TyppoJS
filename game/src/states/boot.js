(function(){
'use strict';

var Boot = function() {};

module.exports = Boot;

Boot.prototype = {
  preload: function() {
    // Load everything needed for the preloader state.
  },

  create: function() {
    this.game.stage.disableVisibilityChange = true;

    this.game.state.start('Preloader');
  }
};
})();
