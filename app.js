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
var guesses = 8;

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

// do we have a user
app.use(function(req, res, next){
  req.session.name = req.body.name;
console.log('name entered: ' + req.session.name);
req.checkBody('name', 'Please enter your name').notEmpty();

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
    'guesses': req.session.guesses,
  };
  next();
}
});

// do we have a random word?
app.use(function(req,res,next){
  if(!context.word){
  //***************creating mystery word and empty spaces
  var words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
  maxRandomNumber = Math.floor(words.length - 1);
  var secretWordIndex = Math.ceil(Math.random() * maxRandomNumber);
  var secretWord = words.splice(secretWordIndex, 1);
  secretWord = secretWord.toString();
  secretWord = secretWord.split('');
  var wordLetters = '';
  for (var i = 0; i < secretWord.length; i++) {
     wordLetters += "_ ";
  }
  console.log(secretWord);
  console.log(wordLetters);
  req.session.word = secretWord;
  req.session.guesses = 8;
  req.session.spaces = wordLetters;
}
next();
});

//do we have empty spaces?
app.use(function(req,res,next){
  next();
});

//do we have guesses left?
app.use(function(req,res,next){
 if(req.session.guesses > 0) {
 context = {
   name: req.session.name,
   guesses: req.session.guesses,
   word: req.session.word,
   wordLetters: req.session.spaces
 };
}
res.render('mysteryword', context);
//next();
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


app.get('/', function(req,res){
  res.redirect('login');
});

//                                        render login page
app.get('/login', function(req, res) {

  res.render('login', context);
});

// redirect from index to login
app.get('/mysteryword', function(req, res) {

  console.log('mystery page' + context.name);
//   if(!context.name){
//     res.redirect('/login');
// }
  res.redirect('/login');
});


//                                        redirect to login if no name or
app.post('/mysteryword', function(req, res) {

  res.render('mysteryword', context);
});

app.post('/login', function(req, res) {
  // req.session.name = req.body.name;
res.render('login', context);
});

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
