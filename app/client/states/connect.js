(function(){
'use strict';

var Connect = function() {},
    SocketHandler   = require('../socket-handler');

module.exports = Connect;

Connect.prototype = {
  create: function() {
    this.game.stage.backgroundColor = '#C8F7C5';

    // Hack/magic numbers.. Should make it into a webfont and use it like that instead.
    var connectingWidth = 307;
    var connectingHeight = 59;
    var loadingWidth = 120;
    var loadingHeight = 128;


    var connectingText = this.game.add.sprite(
      this.world.centerX,
      this.world.centerY-150,
      'connectingText'
    );
    connectingText.anchor.setTo(0.5, 0.5);

    var loader = this.game.add.sprite(
      this.world.centerX,
      this.world.centerY,
      'loadingAnimation'
    );
    loader.anchor.setTo(0.5, 0.5);

    loader.animations.add('loop');
    loader.animations.play('loop', 15, true);
  },

  update: function() {
    if (this.game.socketHandler.connected && this.game.socketHandler.nickname !== null) {
      this.game.state.start('Menu');
    }
  }
};
})();
