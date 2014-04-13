'use strict';

var express     = require('express')
  , stylus      = require('stylus')
  , nib         = require('nib')
  , browserify  = require('browserify-middleware')
  , app         = module.exports = express();

app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', __dirname + '/app/views');

app.use(stylus.middleware({
  src: __dirname + '/assets',
  dest: __dirname + '/public',
  compile: function(str, path) {return stylus(str).set('filename', path).use(nib());}
}));
app.use(express.static(__dirname + '/public'));

require('./config/routes')(app);

app.listen(app.get('port'), function() {
  console.log('Listening on %d', app.get('port'));
});
