(function(){
'use strict';

var SetNick            = function() {},
    SocketHandler      = require('../socket-handler');

module.exports = SetNick;

SetNick.prototype = {
  create: function() {
    console.log('started nick state');
    this.game.stage.backgroundColor = '#1abc9c';
    this.fadeOutWarning = 0;

    this.nickText = this.add.text(this.world.centerX, this.world.centerY-100, 'Hi there! \nPlease enter your nickname :)', {
      font: '45pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    });

    this.warningText = this.add.text(this.world.centerX, this.world.centerY+250, 'Ouch, maybe try a shorter nick?', {
      font: '40pt hallo_sansblack',
      fill: '#e67e22',
      align: 'center'
    });
    this.warningText.alpha = 0;

    this.warningText.anchor.setTo(0.5, 0.5);
    this.nickText.anchor.setTo(0.5, 0.5);

    this.nickInput = document.querySelector('#nick-input');

    this.nickInput.style.display = 'inline';
    this.nickInput.focus();

    this.startButton = this.add.button(this.world.centerX, this.world.centerY+150,
     'startButton', this.registerInput, this, 1, 0, 0);
    this.startButton.anchor.setTo(0.5, 0.5);
  },

  registerInput: function() {
    var nick = this.nickInput.value;
    if (nick.length && nick.length < 15) {
      this.game.nickname = nick;
      this.nickInput.style.display = 'none';
      this.game.state.start('Connect');
    }
    else if (!nick.length) {
      this.warningText.text = 'Please enter a nick!';
      this.warningText.alpha = 1;
      this.fadeOutWarning = this.time.now + 2000;
    }
    else {
      this.warningText.text = 'Ouch, maybe try a shorter nick?';
      this.warningText.alpha = 1;
      this.fadeOutWarning = this.time.now + 2000;
    }
  },

  update: function() {
    if (this.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      this.registerInput();
    }

    if (this.time.now > this.fadeOutWarning && this.fadeOutWarning !== 0) {
      this.add.tween(this.warningText).to({ alpha: 0 }, 400, Phaser.Easing.Cubic.Out, true);
      this.fadeOutWarning = 0;
    }
  }

};

})();
