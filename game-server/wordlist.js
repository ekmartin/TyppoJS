var fs = require('fs'),
    _  = require('lodash');

var WordList = function WordList(maxLength) {
  // Should be stored in a database instead.

  this.colors = ['red', 'blue', 'green'];
  var that = this;
  //#GHETTOHACK
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
      x: _.random(1, 13-word.length),
      color: _.sample(this.colors, 1)[0]
    };
  }, this);

  return wordList;

}

module.exports = WordList;
