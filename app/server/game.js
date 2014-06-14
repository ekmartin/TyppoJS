'use strict';

var gameConstants = require('../common/game-constants'),
    Typpo         = require('../common/typpo'),
    _             = require('lodash');

var Game = function(match, wordList) {
  this.match = match;
  this.wordList = wordList;

  this.isLive = true;

  this.players = [];

  this.players.push({
    uuid: this.match.players[0].uuid,
    typpo: new Typpo(this, false, true, _.cloneDeep(wordList), {
      width: gameConstants.WIDTH,
      height: gameConstants.HEIGHT,
      positionX: gameConstants.TILE_SIZE.x,
      positionY: 0
    }, this.match.players[0].uuid)
  });

  this.players.push({
    uuid: this.match.players[1].uuid,
    typpo: new Typpo(this, false, true, _.cloneDeep(wordList), {
      width: gameConstants.WIDTH,
      height: gameConstants.HEIGHT,
      positionX: this.players[0].typpo.getEndX() + gameConstants.TILE_SIZE.x,
      positionY: 0
    }, this.match.players[1].uuid)
  });

  var time = Date.now();
  console.log('starting now!', time);
  _.forEach(this.players, function(player) {
    player.typpo.startGame(time);
  });

  this.updateLoop = setInterval(this.update.bind(this), 5);
};

Game.prototype.gameDone = function(won, emit, playerID) {
  if (this.isLive) {
    console.log('somebody lost');
    clearInterval(this.updateLoop);
    this.match.playerLost(playerID);
    this.isLive = false;
  }
};

Game.prototype.endGame = function() {
  if (this.isLive) {
    clearInterval(this.updateLoop);
    this.isLive = false;
  }
};

Game.prototype.findPlayer = function(playerID) {
  return _.find(this.players, { uuid: playerID });
};

Game.prototype.fadeBlock = function(playerID, blockID) {
  if (this.isLive) {
    var player = this.findPlayer(playerID);
    var block = _.find(player.typpo.blocks, { id: blockID });
    player.typpo.fadeBlock(block);
  }
};

Game.prototype.giveUpCurrentBlock = function(playerID) {
  if (this.isLive) {
    var player = this.findPlayer(playerID);
    player.typpo.giveUpCurrentBlock();
  }
};

Game.prototype.greyBlock = function(playerID) {
  if (this.isLive) {
    var sendPlayer = this.findPlayer(playerID);
    var player = _.without(this.players, sendPlayer)[0];
    player.typpo.greyCounter++;
  }
};

Game.prototype.update = function() {
  if (this.isLive) {
    _.map(this.players, function(player) {
      player.typpo.tick();
    });
  }
};

module.exports = Game;
