module.exports = {

  landing: function(req, res) {
    var context = {
      name: req.session.name,
      guessesLeft: req.session.guessesLeft,
      secretWord: req.session.secretWord,
      wordBlanks: req.session.wordBlanks,
      lengthOfWord: req.session.lengthOfWord,
      guessedLetter: req.session.guess
    };
    res.render('mysteryWord', context);
  },
  play: function(req, res) {
    var context = {
      name: req.session.name,
      guessesLeft: req.session.guessesLeft,
      secretWord: req.session.word,
      wordBlanks: req.session.wordBlanks,
      lengthOfWord: req.session.lengthOfWord,
      guessedLetters: req.session.guessedLetters
    };
    req.session.guess = req.body.guess;
    if (req.body.guess === '') {
      context.error = "If you want to play the game, you have to enter a letter";
      res.render('mysteryWord', context);
      return;
    } else {
      if (req.body.guess) {
        req.checkBody('guess', 'Hey what kind of stunt are you trying to pull? One letter at a time please.').isLength({
          min: 1,
          max: 1
        });
        req.checkBody('guess', 'I don\'t know where you\'re from, but around here we only use letters in our words.').isAlpha();
      }
      var errors = req.validationErrors();
      if (!errors) {
        req.session.guess = req.body.guess;
        context.guess = req.session.guess;
        //check for duplicate letters
        if (req.session.guessedLetters.length > 0) {
          for (var i = 0; i < req.session.guessedLetters.length; i++) {
            if (req.session.guessedLetters.includes(req.session.guess)) {
              context.duplicateLetterMessage = "Hey, stop guessing me!!!!!";
              res.render('mysteryWord', context);
              return;
            }
          }
        }
        //push guessed letter into array to display on screen
        req.session.guessedLetters.push(req.body.guess);
        context.guessedLetters = req.session.guessedLetters;
        //loop through and check guessed letter against letters in word
        req.session.lettersCorrect = 0;
        for (var i = 0; i < req.session.word.length; i++) {
          if (req.session.guess === req.session.secretWord[i]) {
            //this is working, displays letters in place of blanks
            req.session.wordBlanks[i] = req.session.guess;
            req.session.lettersCorrect++;
            //remove one from the length of the word, when it's 0 the word is guessed
            //this is working, lengthOfWord goes to 0 as correct guesses are made if 0 then displays congrats message
            req.session.lengthOfWord--;
            if (req.session.lengthOfWord === 0) {
              context.gameOver = 'Congratulations, you guessed the secret word!';
              res.render('mysteryWord', context);
              return;
            }
          }
        }
        if (req.session.lettersCorrect === 0) {
          req.session.guessesLeft--;
          //this is working, but need to fix the word it displays
          if (req.session.guessesLeft === 0) {
            context.guessesLeft = 0;
            context.gameOver = "Better luck next time!";
            res.render('mysteryWord', context);
            return;
          }
        }
        context.guessesLeft = req.session.guessesLeft;

      } else {
        context.errors = errors;
      }
    }
    res.render('mysteryWord', context);
  }
};
