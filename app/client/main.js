(function(){
'use strict';

var game = new Phaser.Game(1056, 700, Phaser.AUTO, 'game-container');

// Connect to the socket.io server and add the connection to the current game for future reference.
// First argument is connection url, if we set it to null socket.io will determine it.
game.state.game.socket = io(null, {
  reconnectionDelay: 200,
  reconnectionDelayMax: 200
});

game.state.add('Boot', require('./states/boot'));
game.state.add('Preloader', require('./states/preloader'));
game.state.add('SetNick', require('./states/set-nick'));
game.state.add('Menu', require('./states/menu'));
game.state.add('Connect', require('./states/connect'));
game.state.add('Game', require('./states/game').constructor);
game.state.add('Done', require('./states/done'));

game.state.start('Boot');
}());
