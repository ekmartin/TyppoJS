'use strict';

var express     = require('express')
  , app         = module.exports = express()
  , server      = require('http').Server(app)
  , io          = require('socket.io')(server)
  , stylus      = require('stylus')
  , nib         = require('nib')
  , colors      = require('colors')
  , WordList    = require('./game-server/WordList')
  , gameServer  = require('./game-server/server');

app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', __dirname + '/game/views');

app.use(stylus.middleware({
  src: __dirname + '/assets',
  dest: __dirname + '/public',
  compile: function(str, path) {return stylus(str).set('filename', path).use(nib());}
}));
app.use(express.static(__dirname + '/public'));

require('./config/routes')(app);

server.listen(app.get('port'), function() {
  console.log('Listening on %d', app.get('port'));
});

var wordList = new WordList(13);

gameServer(io, wordList);
