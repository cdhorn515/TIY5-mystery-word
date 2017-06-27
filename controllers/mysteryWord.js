module.exports = {
  landing: function(req, res) {
    var context = {
      name: req.session.name,
      guessesLeft: req.session.guesses,
      secretWord: req.session.secretWord,
      wordBlanks: req.session.wordBlanks,
      lengthOfWord: req.session.lengthOfWord,
      // guessedLetter: req.session.guess
    };
    res.render('mysteryWord', context);
  },
  play: function(req, res) {
    req.session.guess = req.body.guess;
    var context = {
      name: req.session.name
      ,guessesLeft: req.session.guesses
      ,secretWord: req.session.secretWord
      ,wordBlanks: req.session.wordBlanks
      ,lengthOfWord: req.session.lengthOfWord
      ,displayGuessedLetters: []
      ,wordLetters: ''
      ,guess: ''
      ,errors: ' '
    };
    //do we have empty spaces?
    for (var i = 0; i < req.session.word; i++) {
      if (wordLetters[i] === '_ ') {
        return;
      } else {
        //// FIXME: send parameter congrat msg or configure mustache?
        context = {
          gameOver: true
        };
      }
    }
    //do we have guesses left?
    // app.use(function(req, res, next) {
    if (context.guessesLeft > 0) {
      console.log("line 38 guesses left: " + context.guessesLeft);
    } else {
      if (context.guessesLeft === 0) {
        console.log('no guesses left ' + context.guessesLeft);
      }
    }
    //do we have a guess?
    //check if guess is one letter
  //  FIXME:
    req.checkBody('guess', 'what kind of word are you trying to spell?').isAlpha();
    req.checkBody('guess', 'one letter at a time please').isLength({
      min:1, max: 1
    });
    req.checkBody('guess', 'if you don\'t enter a letter you can\'t play the game').isEmpty();
    var errors = req.validationErrors();
    if (errors) {
      context.errors = errors;
      console.log(context.errors);
      res.render('mysteryWord', context);
    } else {
      req.body.guess = req.session.guess;
      context.guess = req.session.guess;
      context.displayGuessedLetters += req.session.guess;
      console.log(context.guess);
      console.log(context.displayGuessedLetters);
      var guessesLeft = req.session.guesses;
      // req.session.guess.toLowerCase();
      //  displayLetters = req.session.guess;
      for (i = 0; i < req.session.word.length; i++) {
        if (req.session.guess === req.session.secretWord[i]) {
          context.wordBlanks[i] = req.session.guess;
          context.lengthOfWord--;
          console.log('60: ' + context.lengthOfWord);
        } else {
          context.guessesLeft--;
          console.log('63 guesses left: ' + context.guessesLeft);
        }
      }
      res.render('mysteryWord', context);
    }
//end of play key
  }



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

};
