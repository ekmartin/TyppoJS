(function(){
'use strict';

var Boot = function() {};

module.exports = Boot;

Boot.prototype = {
  preload: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.maxWidth = 1056;
    this.scale.maxHeight = 700;
    this.ratio = this.scale.maxWidth/this.scale.maxHeight;

    window.onresize = this.gameResized.bind(this);
    this.scale.setShowAll();
    this.scale.refresh();
    this.gameResized();

    this.stage.backgroundColor = '#1abc9c';

    this.load.spritesheet('lightLoadingAnimation', '/assets/img/lightLoadingAnimation.png', 120, 128);
    this.load.spritesheet('loadingAnimation', '/assets/img/loadingAnimation.png', 120, 128);
  },

  create: function() {
    this.stage.disableVisibilityChange = true;

    this.game.state.start('Preloader');
  },

  gameResized: function(e) {

    var nickInput = document.querySelector('#nick-input');
    var canvas = document.querySelector('canvas');

    var marginLeft = parseInt(window.getComputedStyle(canvas)['margin-left'], 10);
    nickInput.style.width = this.scale.width/2;
    nickInput.style.height = this.scale.height/8;
    nickInput.style.top = this.scale.height/2+15;
    nickInput.style.left = (marginLeft + this.scale.width/4) + 'px';
  }
};
})();
