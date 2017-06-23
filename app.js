var express = require('express');
var mustacheExpress = require('mustache-express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'unicorn cats',
  resave: false,
  saveUninitialized: true
}));
var context = {};

app.get('/', function(req, res){
  res.render('index');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/', function(req, res){
  console.log('username');
  res.render('index');
});

app.listen(3000, function(){
  console.log("app launch successful!");
});
