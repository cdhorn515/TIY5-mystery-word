const fs = require('fs');

module.exports = {
createWord: function(req, res, next) {
  if (!req.session.word) {
    req.session.guessesLeft = 8;
    req.session.guessedLetters = [];
    //***************creating mystery word
    var allWords = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
    var words = allWords.filter(function(word){
      return word.length > 3 && word.length < 10;
    });
    maxRandomNumber = Math.floor(words.length - 1);
    var secretWordIndex = Math.ceil(Math.random() * maxRandomNumber);
    var secretWord = words.splice(secretWordIndex, 1);
    secretWord = secretWord.toString();
    req.session.word = secretWord;
    console.log('75 ', req.session.word);
    //split word into array then create blanks to rep letters
    secretWord = secretWord.split('');
    req.session.lengthOfWord = secretWord.length;
    //es6 array fill syntax
    var wordBlanks = Array(secretWord.length).fill('_');
    req.session.secretWord = secretWord;
    req.session.wordBlanks = wordBlanks;
  }
  next();
}
};
