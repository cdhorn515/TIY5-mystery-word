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
    req.session.guess = req.body.guess;
    var context = {
      name: req.session.name,
      guessesLeft: req.session.guessesLeft,
      secretWord: req.session.secretWord,
      wordBlanks: req.session.wordBlanks,
      lengthOfWord: req.session.lengthOfWord,
      guessedLetters: req.session.guessedLetters

    };
    //do we have empty spaces?
    // for (var i = 0; i < req.session.word; i++) {
    //   // if (wordLetters[i] === '_ ') {
    //   if (req.session.lengthOfWord > 0) {
    //     return;
    //   } else {
    //     //// FIXME: send parameter congrat msg or configure mustache?
    //     context.gameOver = "Congratulations! You guessed the secret word!";
    //   }
    // }
    if (req.session.lengthOfWord < 1) {
      context.gameOver = 'Congratulations, you guessed the secret word!';
      res.render('mysteryWord', context);
      return;
      // return context.gameOver;
    }
    //do we have guesses left?
    if (req.session.guessesLeft > 0) {
      console.log("line 38 guesses left: " + req.session.guessesLeft);
    } else {
      if (req.session.guessesLeft < 1) {
        console.log('line 41 no guesses left ' + req.session.guessesLeft);
        res.render('mysteryWord', context);
        return;
      }
    }
    //do we have a guess?
    //check if guess is one letter
    //  FIXME:
    // req.checkBody('guess', 'what kind of word are you trying to spell?').isAlpha();
    // req.checkBody('guess', 'one letter at a time please').isLength({
    //   min: 1,
    //   max: 1
    // });
    // req.checkBody('guess', 'if you don\'t enter a letter you can\'t play the game').isEmpty();
    // var errors = req.validationErrors();
    // if (errors) {
    //   context.errors = errors;
    //   console.log(context.errors);
    //   res.render('mysteryWord', context);
    // } else {
    //store guess letter in session
    // }


    // if (req.session.lengthOfWord < 1) {
    //   context.gameOver = 'Congratulations, you guessed the secret word!';
    //   render('mysteryWord', context);
    //   // return context.gameOver;
    // }
    // //store guess letter in session
    //
    //     req.session.guess = req.body.guess;
    //     context.guess = req.session.guess;
    // console.log('78 ' + typeof req.session.guessedLetters);
    // for (i = 0; i < req.session.guessedLetters; i++) {
    //   if (req.body.guess === req.session.guessedLetters[i]) {
    //     context.duplicateLetterMessage = "Oops! You've already tried that letter";
    //     return;
    //   }
    // }
    if (req.body.guess) {
      console.log('87 ', typeof req.body.guess);
      console.log('85 ', req.session.guessesLeft);
      req.checkBody('guess', 'Hey what kind of stunt are you trying to pull? Please just enter one letter').isLength({
        max: 1
      });
    }
    var errors = req.validationErrors();
    if (!errors) {
      req.session.guess = req.body.guess;
      context.guess = req.session.guess;
      // console.log('here', req.session.guessedLetters.length);
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
      // req.session.guessesLeft--;
      // }
      // }
      //loop through and check guessed letter against letters in word
req.session.lettersCorrect = 0;
      for (var i = 0; i < req.session.word.length; i++) {

        if (req.session.guess === req.session.secretWord[i]) {
          //this is working, displays letters in place of blanks
          req.session.wordBlanks[i] = req.session.guess;
          req.session.lettersCorrect++;
          //remove one from the length of the word, when it's 0 the word is guessed
          //this is working, lengthOfWord goes to 0 as correct guesses are made
          req.session.lengthOfWord--;
          // return lettersCorrect;
          // req.session.lengthOfWord--;
          // req.session.guessesLeft++;
          // if (req.session.guessesLeft > 8) {
          //   req.session.guessesLeft = 8;
          //   context.guessesLeft = req.session.guessesLeft;
        }
        // console.log("here ", lettersCorrect);
        }
        if (req.session.lettersCorrect === 0) {
          req.session.guessesLeft--;

        // console.log('here', lettersCorrect);
      }
      context.guessesLeft = req.session.guessesLeft;

    } else {
      context.errors = errors;
    }

    res.render('mysteryWord', context);

    // context.guessesLeft--;
// if (errors)
    //     console.log('130 guesses left: ' + context.guessesLeft);
    //
    // }

    // }
    // }
    //end of play key
    // }



    // if (req.session.wordBlanks.includes(req.session.guess)) {
    //   context.duplicateLetterMessage = "Oops! You've already tried that letter";
    //   return;

    //if there are no spaces left to guess
    /*
    app.use('/mysteryword', function(req, res, next){
      if(no spaces left){
      res.redirect(finished page);
    } else{
    next();
    }
    });
    //Do we have guesses?
    app.use('/mysteryword', function(req,res,next){
    if(no guesses left){
    res.redirect(sorry try again page)
    }else{
    res.redirect('mystery', #guesses);
    }
    });

    //Is the guess only one letter?
    app.use('/mysteryword', function(req, res, next) {
    req.checkBody('guess', 'enter one letter per guess please').notEmpty().isAlpha().isLength({max: 1});
    var guessedLetter = req.body.guess;
    guessedLetter.toLowerCase();
    req.session.guess = guessedLetter;
    context = {
      name: req.session.name,
      guessesLeft: req.session.guessesLeft,
      word: req.session.word,
      wordLetters: req.session.spaces,
      guessedLetters: req.session.guess
    };
      if(input !one letter){
      res.redirect(game page, (one letter only)){
    } else{

    }
    });

    //Does the letter match letter in mystery word?
    app.use('/mysteryword', function(req, res, next){
      for (var i = 0; i < word.length; i++){
      if word[i] === req.body.input {
      substitute letter for _ (replace?);
    } else{
    guesses--;
    res.send/render?(sorry that letter is not in this word);
    }
    for both: add letter to letters guessed array displayed on screen

    }
    });

    */

  }
};
