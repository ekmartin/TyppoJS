(function(){
'use strict';

var Preloader   = function() {};

module.exports = Preloader;

Preloader.prototype = {
  preload: function() {

    this.game.stage.backgroundColor = '#1abc9c';

    this.hintText = this.add.text(
      this.world.centerX,
      this.world.centerY-150,
      'Loading!',
      {
       font: '45pt hallo_sansblack',
        fill: '#e67e22',
        align: 'center'
      }
    );
    this.hintText.anchor.setTo(0.5, 0.5);

    this.loader = this.game.add.sprite(
      this.world.centerX,
      this.world.centerY + 75,
      'lightLoadingAnimation'
    );
    this.loader.anchor.setTo(0.5, 0.5);
    this.loader.animations.add('loop');
    this.loader.animations.play('loop', 15, true);

    // Menu:
    this.load.image('logo', '/assets/img/logo.png');
    this.load.spritesheet('startButton', '/assets/img/startButton.png', 343, 65);
    this.load.spritesheet('findGame', '/assets/img/findGame.png', 594, 112);
    this.load.spritesheet('privateMatch', '/assets/img/privateMatch.png', 594, 112);
    this.load.spritesheet('menuButton', '/assets/img/menuButton.png', 297, 112);

    // Game:
    this.load.image('bgTile', '/assets/img/BGTile.png');
    this.load.image('lockedTile','/assets/img/lockedTile.png');
    this.load.image('wallTile','/assets/img/WallTile.png');
    this.load.image('blueTile', '/assets/img/blueTile.png');
    this.load.image('blueFaded', '/assets/img/blueFaded.png');
    this.load.image('yellowTile', '/assets/img/yellowTile.png');
    this.load.image('yellowFaded', '/assets/img/yellowFaded.png');
    this.load.image('greenTile', '/assets/img/greenTile.png');
    this.load.image('greenFaded', '/assets/img/greenFaded.png');
    this.load.image('redTile', '/assets/img/redTile.png');
    this.load.image('redFaded', '/assets/img/redFaded.png');
    this.load.image('purpleTile', '/assets/img/purpleTile.png');
    this.load.image('purpleFaded', '/assets/img/purpleFaded.png');
    this.load.image('darkBlueTile', '/assets/img/darkBlueTile.png');
    this.load.image('darkBlueFaded', '/assets/img/darkBlueFaded.png');

  },

  create: function() {
    this.game.state.start('SetNick');
  }
};

})();
