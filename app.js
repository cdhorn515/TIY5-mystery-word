var express = require('express');
var mustacheExpress = require('mustache-express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var expressValidator = require('express-validator');
var fs = require('fs');
var mysteryWordController = require('./controllers/mysteryWord');
var loginController = require('./controllers/login');

var app = express();

// var context = {
//   name: ''
//   ,guessesLeft: 0
//   ,secretWord: ''
//   ,wordBlanks: []
//   ,lengthOfWord: 0
//   ,guessedLetters: []
//   ,wordLetters: ''
//   ,guess: ''
//   ,errors: ''
// };

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
/////----------MIDDLEWARE---------
//do we have a user--
app.use(function(req, res, next) {
  var pathname = parseurl(req).pathname;
  if (!req.session.name && pathname != '/login') {
    console.log('false');
    console.log('please enter your name');
    res.redirect('login');
  } else {
    console.log('true');
    next();
  }
});

// do we have a random word?
app.use(function(req, res, next) {
  if (!req.session.word) {
    console.log('59: no session.word');
    // var guesses = 8;
    req.session.guessesLeft = 8;
    req.session.guessedLetters = [];
    //***************creating mystery word and empty spaces
    var allWords = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
    console.log('65', allWords.length);
    var words = allWords.filter(function(word){
      return word.length > 3 && word.length < 10;
    });
    console.log('69', words.length);
    maxRandomNumber = Math.floor(words.length - 1);
    var secretWordIndex = Math.ceil(Math.random() * maxRandomNumber);
    var secretWord = words.splice(secretWordIndex, 1);
    secretWord = secretWord.toString();
    req.session.word = secretWord;
    secretWord = secretWord.split('');
    // console.log('type of secretword: ' + typeof(secretWord)); object--array
    //length of word to eventually be stored in context obj, every time guess a letter correct subtract one
    req.session.lengthOfWord = secretWord.length;

    //es6 array fill syntax
    var wordBlanks = Array(secretWord.length).fill('_');
    // for (var i = 0; i < secretWord.length; i++) {
    //   wordBlanks += "_ ";
    // }
    //shows word in array, individual letters
    console.log(secretWord);
    // console.log('type of wordLetters: ' + typeof(wordLetters)); string
    //shows _ for each letter in word
    console.log(wordBlanks);
    req.session.secretWord = secretWord;
    req.session.wordBlanks = wordBlanks;
    // console.log('76 ' + req.sessions.guesses);
  }
  next();
});
/////----------ENDPOINTS

app.get('/mysteryWord', mysteryWordController.landing);

app.post('/mysteryWord', mysteryWordController.play);

//render login page
app.get('/login', function(req, res) {
var context = {};
  res.render('login', context);
});

app.post('/login', function(req, res) {
  req.checkBody('name', 'Please enter your name').notEmpty();
  var errors = req.validationErrors();
  var context = {};

  if(!req.body.name){
    // console.log('line 114: please enter your name');
}
  if(errors){
     context = {
      errors: errors
    };
    res.render('login', context);
  } else if (req.body.name){
  req.session.name = req.body.name;

  res.redirect('mysteryWord');
}
});
//
// app.get('/mysteryWord', function(req, res) {
//
//   context = {
//     name: req.session.name,
//     guessesLeft: req.session.guesses,
//     secretWord: req.session.secretWord,
//     wordBlanks: req.session.wordBlanks
//   };
//   res.render('mysteryWord', context);
// });

app.listen(3000, function() {
  console.log("app launch successful!");
});
