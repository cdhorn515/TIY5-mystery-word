var mysteryWordController = require('./controllers/mysteryWord');
var loginController = require('./controllers/login');
var indexController = require('./controllers/index');


module.exports = function(app) {
  app.get('/mysteryWord', mysteryWordController.landing);

  app.post('/mysteryWord', mysteryWordController.play);

  app.get('/login', loginController.landing);

  app.post('/login', loginController.checkForName);

  app.get('/playAgain', mysteryWordController.replay);

  app.post('/end', indexController.goodbyeMsg);

};
