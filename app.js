var express = require('express');
var mustacheExpress = require('mustache-express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var expressValidator = require('express-validator');
var fs = require('fs');

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
  secret: 'unicorn cats',
  resave: false,
  saveUninitialized: true
}));

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
var context = [{
  'name': 'Sami'
}];
//                                        redirect from index to login
app.get('/', function(req, res) {
  res.redirect('/login');
});
//                                        render login page
app.get('/login', function(req, res) {

  res.render('login');
});
//                                        redirect to login if no name or
app.get('/mysteryword', function(req, res) {
  // if (!req.body.name){
  //   res.redirect('login');
  // } else {
  //
  // res.render('mysteryword', context);
// }
res.redirect('login');
});

app.post('/login', function(req, res) {
  var session = req.session;
  console.log(session);
  // var userId = req.genid;
  // console.log(userId);
  req.checkBody('name', 'Please enter your name').notEmpty();

  var errors = req.validationErrors();
  var context = {};

  if (errors) {
    context.errors = errors;
  }
  context.name = req.body.name;

  if (req.body.name) {
      var guesses = 8;
       context = {
        players: [{
          'name': 'Christina',
          'guesses': function(guess) {
            guesses = guesses - 1;
            console.log(guesses);
            return guesses;
          },
          'word': [],
        }]
      };
      // }
      //***************creating mystery word
      var words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
      maxRandomNumber = Math.floor(words.length - 1);
      var secretWordIndex = Math.ceil(Math.random() * maxRandomNumber);
      //secretWord is an array
      var secretWord = words.splice(secretWordIndex, 1);
      console.log('secretword: ' + secretWord);
      context.players.word = secretWord;
        var hiddenLetters = "";
      for (var i = 0; i < secretWord.length; i++) {
        hiddenLetters += "_";
        console.log("hiddenLetters: " + hiddenLetters);
          return hiddenLetters;
      }
      context.hiddenWord = hiddenLetters;
    console.log('context: ' + context);

    res.redirect('/mysteryword');
  } else {
    res.redirect('/login');
    console.log('please enter your name');
  }
});

app.listen(3000, function() {
  console.log("making progress, app launch successful!");
});



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
