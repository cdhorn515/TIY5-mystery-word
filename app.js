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

//do we have a user
app.use(function(req, res, next){
  var pathname = parseurl(req).pathname;
  console.log(req.body.name);
  if(!req.body.name && pathname !== '/login'){
  res.redirect('/login');
} else {
  // res.redirect('/mysteryword');
  next();
}
});
var context = {
  secretWord: ''
};
// generate random word
// app.use(function(req,res,next){
//   if(context.secretWord === ''){
//   //***************creating mystery word
//   var words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
//   maxRandomNumber = Math.floor(words.length - 1);
//   var secretWordIndex = Math.ceil(Math.random() * maxRandomNumber);
//   var secretWord = words.splice(secretWordIndex, 1);
//   secretWord = secretWord.toString();
//   context.word = secretWord;
//   console.log(context.word);
//   secretWord = secretWord.split('');
//   context.wordLetters = '';
//   for (var i = 0; i < secretWord.length; i++) {
//     context.wordLetters = "_" + " ";
//   }
//   context.guesses = 8;
//   }
//   res.render('mysteryword', context);
// });
//if there are no spaces left to guess
/*
app.use('/mysteryword', function(req, res, next){
  if(no spaces left){
  res.redirect(finished page);
} else{
next();
}
});
//checking if there are guesses left
app.use('/mysteryword', function(req,res,next){
if(no guesses left){
res.redirect(sorry try again page)
}else{
res.redirect('mystery', #guesses);
}
});
//checking if input was one letter
app.use('/mysteryword', function(req, res, next) {
  if(input !one letter){
  res.redirect(game page, (one letter only)){
} else{
  next()
}
});
//looping through mystery word with selected letter
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


// app.post('/login/', function(req, res){
//   console.log(req.body.name);
//   context.name = req.body.name;
//   if (req.session.name === 'Christina'){
//     res.render('mysteryword', context);
//   } else {
//     res.redirect('/login');
//   }
// });
  // var name = req.params.name;
  //
  // if (name !== undefined){
  //   res.redirect('/mysteryword');
  // } else{
  //   res.redirect('/login');
// }
// res.send({'user': req.body.name});
// });

app.get('/', function(req,res){
  res.redirect('login');
});

//                                        render login page
app.get('/login', function(req, res) {

  res.render('login');
});

//redirect from index to login
app.get('/mysteryword', function(req, res) {
  // if(!context.name){
  //   res.redirect('/login');
  // } else{

  res.render('mysteryword', context);
});


//                                        redirect to login if no name or
app.post('/mysteryword', function(req, res) {

  res.render('mysteryword', context);
});

app.post('/login', function(req, res) {
  console.log('name entered: ' + req.body.name);
  // req.checkBody('name', 'Please enter your name').notEmpty();

  if (req.body.name) {

    console.log('true');
    var context = {
      'name': req.body.name,
      'guesses': 8
    };
    res.render('mysteryword', context);
  } else {
    console.log('false');
    res.redirect('/login');
    console.log('please enter your name');
  }
});

app.listen(3000, function() {
  console.log("app launch successful!");
});
//put stuff here so code above isn't messy
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
