var express = require('express');
var mustacheExpress = require('mustache-express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var expressValidator = require('express-validator');
var app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'unicorn cats',
  resave: false,
  saveUninitialized: true
}));

var context = [
    {'name': 'Sami'}
];

// check to see if we have a session for name
app.use(function(req, res, next) {
  var pathname = parseurl(req).pathname;

  if (req.body.name) {
      console.log(req.body.name);
    res.redirect('/mysteryword');
  } else {
    // res.redirect('/');
    console.log('enter a name please');

    next();
  }
});

app.get('/', function(req, res){
  res.render('index');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/mysteryword', function(req,res){
  res.render('mysteryword');
});

app.post('/login', function(req, res){
  var username = req.body.name;
  var session = req.session;
  console.log(username);
  console.log(session);
  if (req.body.name){
  res.redirect('/mysteryword');
} else {
  res.redirect('/login');
}
});

app.listen(3000, function(){
  console.log("app launch successful!");
});
