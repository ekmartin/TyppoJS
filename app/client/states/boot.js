(function(){
'use strict';

var _    = require('lodash'),
    Boot = function() {};

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
    console.log('started boot state');
    this.stage.disableVisibilityChange = true;

    this.game.state.start('Preloader');
  },

  gameResized: function(e) {

    /*
    Calculated from the start dimensions:
    Canvas: 1056x700 (210px above)
    Input: 550x85
     */
    var percentages = {
        width: 0.5, // 550px/1056px
        height: 0.12, // 85px/1056px
        top: 0.48, // (550px-210px)/700px
        font: 0.03
    };

    var start = {
        margin: {
            top: 208
        },
        canvas: {
            width: 1056,
            height: 700
        },
        input: {
            width: 550,
            height: 85,
            top: 342
        }
    };

    var widthFactor = start.input.widht/start.canvas.width;
    var heightFactor = start.input.height/start.canvas.width;
    var topFactor = start.input.top/start.canvas.height + 210;

    var nickInput = document.querySelector('#nick-input');
    var matchInput = document.querySelector('#match-input');
    var canvas = document.querySelector('canvas');

    nickInput.style.width = this.scale.width * percentages.width;
    nickInput.style.height = this.scale.height * percentages.height;
    nickInput.style.top = this.scale.height * percentages.top + 210;
    nickInput.style.fontSize = this.scale.width * 0.04 + 'px';

    matchInput.style.width = this.scale.width * percentages.width;
    matchInput.style.height = this.scale.height * percentages.height;
    matchInput.style.top = this.scale.height * percentages.top + 210;
    matchInput.style.fontSize = this.scale.width * 0.04 + 'px';
  }
};
})();
