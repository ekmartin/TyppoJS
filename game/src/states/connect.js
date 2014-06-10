(function(){
'use strict';

var Connect = function() {},
    SocketHandler   = require('../game/socket-handler');

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
      this.world.width/2-connectingWidth/2,
      this.world.height/2-connectingHeight/2-150,
      'connectingText'
    );
    connectingText.smoothed = false;

    var loader = this.game.add.sprite(
      this.world.width/2-loadingWidth/2,
      this.world.height/2-loadingHeight/2,
      'loadingAnimation'
    );
    loader.animations.add('loop');
    loader.animations.play('loop', 15, true);

    this.game.socketHandler = new SocketHandler(this.game.socket, 'temp' + this.rnd.integerInRange(0, 9999));
  },

  update: function() {
    if (this.game.socketHandler.connected && this.game.socketHandler.nickname !== null) {
      this.game.state.start('Game');
    }
  }
};
})();
