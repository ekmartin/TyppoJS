'use strict';

var Player = require('./player')
  , Match  = require('./match');

function startServer(io) {
  var playersSearching = [];
  io.sockets.on('connection', function(client) {
    client.emit('connected');

    client.on('hello', function(nickname) {
      var player = new Player(client, nickname);
      client.set('player', player, function() {
        console.log('New player connected with the nickname', nickname, '. Given UUID:', player.uuid);
        client.emit('hello done');
      });
    });

    client.on('setnick', function(nickname) {
      client.get('player', function(player) {
        player.nickname = nickname;
        client.emit('setnick done');
      });
    });

    client.on('findmatch', function() {
      // Could probably emit something back so the player knows something went wrong (TODO).
      var player = client.get('player');
      if (player !== undefined) {
        playersSearching.push(player);
        if (playersSearching.length > 2) {
          console.log('Started a new match between ' + playersSearching[0].nickname + ' (' + playersSearching[0].uuid + ') and ' +
                      playersSearching[1].nickname + ' (' + playersSearching[1].uuid + ').');
          var match = new Match(playersSearching[0], playersSearching[1]);
          player.setMatch(match);
        }
      }
    });

    client.on('disconnect', function() {
      var player = client.get('player');
      if (player.match !== null) {
        player.match.disconnection(player);
      }
      else {
        // delete stuff?
        console.log("Player disconnected without being in a match".blue);
      }
    });
  });
}


module.exports = startServer;
