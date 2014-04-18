(function(){
'use strict';

var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'game-container');

game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Game', require('./states/game'));

game.state.start('Boot');
}());
