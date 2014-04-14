'use strict';

var Preloader   = function() {};

module.exports = Preloader;

Preloader.prototype = {
  preload: function() {
    this.load.image('bgTile', '/assets/img/BGTile.png');
    this.load.image('locked','/assets/img/locked.png');
    this.load.image('wallTile','/assets/img/WallTile.png');
    this.load.image('blueCell','/assets/img/bluecell.png');
    this.load.image('blueFaded','/assets/img/bluefaded.png');
    this.load.image('greenCell','/assets/img/greencell.png');
    this.load.image('greenFaded','/assets/img/greenfaded.png');
    this.load.image('orangeCell','/assets/img/orangecell.png');
    this.load.image('orangeFaded','/assets/img/orangefaded.png');
    this.load.image('purpleCell','/assets/img/purplecell.png');
    this.load.image('purpleFaded','/assets/img/purplefaded.png');
    this.load.image('redCell','/assets/img/redcell.png');
    this.load.image('redFaded','/assets/img/redfaded.png');
    this.load.image('tealCell','/assets/img/tealcell.png');
    this.load.image('tealFaded','/assets/img/tealfaded.png');

  },

  create: function() {
    this.game.state.start('Menu');
  }
};
