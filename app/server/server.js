'use strict';

var Player = require('./player'),
    Match  = require('./match'),
    _      = require('lodash');

function startServer(io, wordList) {
  var playersSearching = [];
  io.on('connection', function(client) {
    client.emit('connected');

    client.on('hello', function(nickname) {
      var player = new Player(client, nickname);
      client.player = player;
      console.log('New player connected with the nickname', nickname, '. Given UUID:', player.uuid);
      client.emit('helloDone');
    });

    client.on('setNick', function(nickname) {
      client.player.nickname = nickname;
      client.emit('setNickDone');
    });

    client.on('findMatch', function() {
      // Could probably emit something back so the player knows something went wrong (TODO).
      playersSearching.push(client.player);
      client.player.searching = true;
      console.log("after".green, playersSearching.length);

      _.forEach(playersSearching, function(player) {
        console.log('Player:', player.nickname);
      });

      if (playersSearching.length >= 2) {
        console.log('Started a new match between ' + playersSearching[0].nickname + ' (' + playersSearching[0].uuid + ') and ' +
                    playersSearching[1].nickname + ' (' + playersSearching[1].uuid + ').');
        var match = new Match(io, wordList, [playersSearching[0], playersSearching[1]]);
        // Remove the two players that just got into a match.
        playersSearching.splice(0, 2);
      }
    });

    client.on('disconnect', function() {
      var player = client.player;
      if (!!player)  {
        if (player.match !== null) {
          console.log("Player disconnected while in a in a match.".red);
          player.match.disconnected(player);
        }
        else if (player.searching) {
          console.log("Player disconnected while searching.".blue);
          playersSearching.splice(playersSearching.indexOf(player), 1);
        }
        else {
          console.log("Player disconnected without searching.".green);
        }
      }
      else {
        console.log('No player record stored.');
      }
    });
  });
}

module.exports = startServer;
