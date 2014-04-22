'use strict';

var uuid = require('node-uuid');

var Player = function(client, nickname) {
  this.client = client;
  this.nickname = nickname;
  this.uuid = uuid.v4();
};
