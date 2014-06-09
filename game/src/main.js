(function(){
'use strict';

var game = new Phaser.Game(1056, 700, Phaser.AUTO, 'game-container');

// Connect to the socket.io server and add the connection to the current game for future reference:
game.state.game.socket = io.connect('http://localhost:3000');


game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Connect', require('./states/connect'));
game.state.add('Game', require('./states/game').constructor);
game.state.add('Done', require('./states/done'));

game.state.start('Boot');
}());
