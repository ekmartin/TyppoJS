(function(){
'use strict';

var Connect = function() {},
    SocketHandler   = require('../socket-handler');

module.exports = Connect;

Connect.prototype = {
  create: function() {
    this.game.stage.backgroundColor = '#1abc9c';

    // Hack/magic numbers.. Should make it into a webfont and use it like that instead.
    var connectingWidth = 307;
    var connectingHeight = 59;
    var loadingWidth = 120;
    var loadingHeight = 128;

    this.connectingText = this.add.text(
      this.world.centerX,
      this.world.centerY-150,
      'Connecting!',
      {
       font: '45pt hallo_sansblack',
        fill: '#e67e22',
        align: 'center'
      }
    );
    this.connectingText.anchor.setTo(0.5, 0.5);


    var loader = this.add.sprite(
      this.world.centerX,
      this.world.centerY,
      'lightLoadingAnimation'
    );
    loader.anchor.setTo(0.5, 0.5);

    loader.animations.add('loop');
    loader.animations.play('loop', 15, true);

    this.game.socketHandler = new SocketHandler(this.game.socket, this.game.nickname, this.game.state);

    if (!!window.location.hash) {
      this.game.socketHandler.joinPrivateMatch();
    }
  },

  update: function() {
    if (this.game.socketHandler.connected && this.game.socketHandler.nickname !== null) {
      if (!window.location.hash) {
        this.game.state.start('Menu');
      }
    }
  }
};
})();
