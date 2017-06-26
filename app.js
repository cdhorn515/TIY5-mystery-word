var express = require('express');
var mustacheExpress = require('mustache-express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var expressValidator = require('express-validator');
var fs = require('fs');

var app = express();
var context = {};
var numberOfGuesses = 8;

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cats',
  resave: false,
  saveUninitialized: true
}));

//do we have a user--if this is taken out we never get to login page, if left in then when we guess a letter it comes back to the login page, code keeps looping back here and reassiging number of guesses
app.use('/login', function(req, res, next) {
  req.session.name = req.body.name;
  req.session.guessesLeft = numberOfGuesses;
  console.log('35 name entered: ' + req.session.name);
  // req.checkBody('name', 'Please enter your name').notEmpty();

  var errors = req.validationErrors();

  if (!req.session.name) {
    console.log('false');
    res.render('login');
    console.log('please enter your name');
  } else {
    console.log('true');
    var context = {
      'errors': errors,
      'name': req.session.name,
      'guessesLeft': req.session.guesses,
    };
    next();
  }
});

// do we have a random word?
app.use(function(req, res, next) {
  if (!req.session.word) {
    // var guesses = 8;
    // req.sessions.guesses = guesses;
    //***************creating mystery word and empty spaces
    var words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
    maxRandomNumber = Math.floor(words.length - 1);
    var secretWordIndex = Math.ceil(Math.random() * maxRandomNumber);
    var secretWord = words.splice(secretWordIndex, 1);
    secretWord = secretWord.toString();
    // console.log('63 type of secretword: ' + typeof(secretWord)); string
    secretWord = secretWord.split('');
    // console.log('65 type of secretword: ' + typeof(secretWord)); object--array
    //length of word to eventually be stored in context obj, every time guess a letter correct subtract one
    req.session.wordLength = secretWord.length;
    var wordLetters= '';
    for (var i = 0; i < secretWord.length; i++) {
      wordLetters += "_ ";
    }
    //shows word in array, individual letters
    console.log(secretWord);
    // console.log('71 type of wordLetters: ' + typeof(wordLetters)); string
    //shows _ for each letter in word
    console.log(wordLetters);
    req.session.word = secretWord;
    req.session.spaces = wordLetters;
    // console.log('76 ' + req.sessions.guesses);
  }
  next();
});

//do we have empty spaces?
app.use(function(req, res, next) {

  // for (var i = 0; i < req.session.word; i++){
  //   if (wordLetters[i] === '_ '){
  //     return;
  //   } else {
  //     //// FIXME: send parameter congrat msg or configure mustache?
  // }  res.send('congratulations, you guessed the word');
  // }
  next();
});
//do we have guesses left?
app.use(function(req, res, next) {
  if (req.session.guessesLeft > 0) {
    console.log(" line 97 guesses left: " + req.session.guessesLeft);
    context = {
      name: req.session.name,
      guessesLeft: req.session.guessesLeft,
      word: req.session.word,
      wordLetters: req.session.spaces,
      wordLength: req.session.wordLength
    };
  } else {
    console.log('no guesses left');
    context = {
      name: req.session.name,
      guessesLeft: 0,
      word: req.session.word,
      wordLetters: req.session.spaces
    };
    // res.render('mysteryWord', context);
  }
  res.render('mysteryWord', context);
  // next();
});

//do we have a guess?
app.use(function(req, res, next) {
      if (req.session.guess) {
        var displayLetters;
        var guessesLeft = req.session.guessesLeft;
        req.session.guess.toLowerCase();
         displayLetters = req.session.guess;
        for (var i = 0; i < req.session.word.length; i++) {
          if (req.session.guess === req.session.word[i]) {
            req.session.spaces[i] = req.session.guess;
          } else {
            guessesLeft--;
            req.session.guessesLeft = guessesLeft;
          }
        }
        context = {
          name: req.session.name,
          guesses: req.session.guesses,
          word: req.session.word,
          wordLetters: req.session.spaces,
          lettersGuessed: displayLetters
        };
      } console.log('138, context: ' + context);
      // next();
      res.render('mysteryWord', context);
    });


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
      next()
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
    next();
    }
    });

    */


    app.get('/mysteryWord', function(req, res) {
      if (req.session.name){
        res.render('mysteryWord', context);
      } else{
          res.redirect('/login');
      }
    });

    //                                        render login page
    app.get('/login', function(req, res) {

      res.render('login', context);
    });

    app.get('/mysteryWord', function(req, res) {
      context = {
        name: req.session.name,
        guessesLeft: req.session.guessesLeft,
        word: req.session.word,
        wordLetters: req.session.spaces
      };
      // console.log('187 mystery get page:' + req.session.name);
      //   if(!req.session.name){
      //     res.redirect('/login');
      // }
      res.render('mysteryWord', context);
    });


    app.post('/mysteryWord', function(req, res) {
      req.session.guess = req.body.guess;
      console.log('230: ' + req.session.guess);
      res.render('mysteryWord', context);
    });

//using middleware to log in otherwise never reach login page
    // app.post('/login', function(req, res) {
      // req.session.name = req.body.name;
      // req.session.guessesLeft = numberOfGuesses;
      // console.log('237 name entered: ' + req.session.name);
      // // req.checkBody('name', 'Please enter your name').notEmpty();
      //
      // // var errors = req.validationErrors();
      //
      // if (!req.session.name) {
      //   console.log('false');
      //   res.render('login');
      //   console.log('please enter your name');
      // } else {
      //   console.log('true');
      //   var context = {
      //     'errors': errors,
      //     'name': req.session.name,
      //     'guessesLeft': req.session.guesses,
      //   };
      //   redirect('/mysteryWord');
      // }

    // });

      // req.session.name = req.body.name;
    //   res.render('login', context);
    // });

    // var name = req.body.name;
    // if (name){
    //   req.session.name = name;
    //   res.redirect('/mysteryWord');
    // } else {
    //   res.redirect('/login');
    // }

    app.listen(3000, function() {
      console.log("app launch successful!");
    });
    //put stuff here so code above isn't messy
    //   console.log('name entered: ' + req.body.name);
    //   req.checkBody('name', 'Please enter your name').notEmpty();
    //
    // var errors = req.validationErrors();
    //
    //   if (req.body.name) {
    //
    //     console.log('true');
    //     var context = {
    //       'errors': errors,
    //       'name': req.body.name,
    //       'guesses': 8,
    //       'secretWord': ''
    //     };
    //     res.render('mysteryword', context);
    //   } else {
    //     console.log('false');
    //     res.redirect('/login');
    //     console.log('please enter your name');
    //   }

    // app.use(function(req, res, next) {
    //   var views = req.session.views;
    //   if (!views) {
    //     views = req.session.views = {};
    //   }
    //   var pathname = parseurl(req).pathname;
    //   views.pathname = (views[pathname] || 0) + 1;
    //
    //   next();
    // });
    //
    // app.use(function(req, res, next){
    //
    //   var userId = req.genid;
    //   context.userId = userId;
    //   console.log(context.userId);
    // next();
    // });
    // console.log(session);


    // check to see if we have a session for name
    // app.use(function(req, res, next) {
    //   var pathname = parseurl(req).pathname;
    //
    //   if (!req.body.name && pathname != '/login') {
    //     console.log('enter a name please');
    //     res.redirect('/login');
    //   } else {
    //     // res.redirect('/');
    //
    //     console.log(req.body.name);
    //   res.redirect('/mysteryword');
    //
    //     next();
    //   }
    // });
