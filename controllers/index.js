module.exports = {

goodbyeMsg: function(req,res){

    var context = {
    endGame: 'Thanks  for playing ' + req.session.name + '! Hope you\'ll come back and play again soon!'
    };
    res.render('index', context);
  }

};
