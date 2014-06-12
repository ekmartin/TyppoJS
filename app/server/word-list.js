var fs            = require('fs'),
    _             = require('lodash'),
    gameConstants = require('../common/game-constants');

var WordList = function WordList(maxLength) {
  // Should be stored in a database instead.

  this.colors = ['blue', 'darkBlue', 'purple', 'green', 'yellow', 'red'];
  var that = this;
  //#GHETTOHACK. Should be in a database or at least read async. Redis maybe?
  var file = fs.readFileSync(__dirname + '/data/wordlist.txt',  { encoding: 'utf8' });
  this.words = file.split('\r\n');
  this.words = this.words.filter(function(word) {
    return word.length <= maxLength;
  });
}

WordList.prototype.getWords = function(n) {
  var words = _.sample(this.words, n);
  var wordList = words.map(function(word, index) {
    return {
      word: word,
      id: index,
      x: _.random(gameConstants.LEFT_WALL, gameConstants.WIDTH - gameConstants.RIGHT_WALL - word.length),
      color: _.sample(this.colors, 1)[0]
    };
  }, this);

  return wordList;

}

module.exports = WordList;
