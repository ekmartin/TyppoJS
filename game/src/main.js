'use strict';

var Phaser = require('Phaser')
  , game   = new Phaser.game(800, 600, Phaser.AUTO, 'game-container');

game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Game', require('./states/game'));

game.state.start('Boot');
