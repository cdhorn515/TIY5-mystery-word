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
var indexController = require('./controllers/index');

var app = express();

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
    res.redirect('login');
  } else {
    next();
  }
});
// do we have a random word?
app.use(function(req, res, next) {
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
});
/////----------ENDPOINTS

app.get('/mysteryWord', mysteryWordController.landing);

app.post('/mysteryWord', mysteryWordController.play);

app.get('/login', loginController.landing);

app.post('/login', loginController.checkForName); 

app.get('/playAgain', mysteryWordController.replay);

app.post('/end', indexController.goodbyeMsg);

app.listen(3000, function() {
  console.log("app launch successful!");
});
