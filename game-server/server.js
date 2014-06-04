'use strict';

var Player = require('./player')
  , Match  = require('./match');

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
      console.log("got inside".blue, playersSearching.length, client.player);
      playersSearching.push(client.player);
      console.log("after".green, playersSearching.length);

      if (playersSearching.length >= 2) {
        console.log('Started a new match between ' + playersSearching[0].nickname + ' (' + playersSearching[0].uuid + ') and ' +
                    playersSearching[1].nickname + ' (' + playersSearching[1].uuid + ').');
        var match = new Match(io, wordList, [playersSearching[0], playersSearching[1]]);
      }
    });

    client.on('disconnect', function() {
      var player = client.player;
      if (player.match !== null) {
        console.log('disconnected');
        player.match.disconnected(player);
      }
      else {
        // delete stuff?
        console.log("Player disconnected without being in a match".blue);
      }
    });
  });
}


module.exports = startServer;
