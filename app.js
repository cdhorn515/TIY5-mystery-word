var express = require('express');
var mustacheExpress = require('mustache-express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var expressValidator = require('express-validator');
var fs = require('fs');
var middleware = require('./middleware');
var router = require('./router');

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
app.use(middleware.createWord);
/////----------ENDPOINTS

router(app);

app.listen(3000, function() {
  console.log("app launch successful!");
});
