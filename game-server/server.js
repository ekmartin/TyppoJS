'use strict';

var Player = require('./player')
  , Match  = require('./match');

function startServer(io) {
  var playersSearching = [];
  io.sockets.on('connection', function(client) {
    function getPlayer(callback) {
      try {
        client.get('player', function(err, player) {
          if (err || player === null) throw 'Couldn\'t get the socket\'s player.';
          callback(player);
        });
      }
      catch (e) {
        console.error('Failed at getting the socket\'s player-object'.red, e);
      }
    }

    client.emit('connected');

    client.on('hello', function(nickname) {
      var player = new Player(client, nickname);
      client.set('player', player, function() {
        console.log('New player connected with the nickname', nickname, '. Given UUID:', player.uuid);
        client.emit('hello done');
      });
    });

    client.on('setnick', function(nickname) {
      getPlayer(function(player) {
        player.nickname = nickname;
        client.emit('setnick done');
      });
    });

    client.on('findmatch', function() {
      // Could probably emit something back so the player knows something went wrong (TODO).
      getPlayer(function(player) {
        console.log("got inside".blue, playersSearching.length);
        playersSearching.push(player);
        if (playersSearching.length >= 2) {
          console.log('Started a new match between ' + playersSearching[0].nickname + ' (' + playersSearching[0].uuid + ') and ' +
                      playersSearching[1].nickname + ' (' + playersSearching[1].uuid + ').');
          var match = new Match(playersSearching[0], playersSearching[1]);
          player.setMatch(match);
        }
      });
    });

    client.on('disconnect', function() {
      getPlayer(function(player) {
        if (player.match !== null) {
          player.match.disconnection(player);
        }
        else {
          // delete stuff?
          console.log("Player disconnected without being in a match".blue);
        }
      });
    });
  });
}


module.exports = startServer;
