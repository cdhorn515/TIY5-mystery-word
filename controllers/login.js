
module.exports = {

landing: function(req, res) {
var context = {};
req.session.name = '';
req.session.word = '';
  res.render('login', context);
},

checkForName: function(req, res) {
  req.checkBody('name', 'Please enter your name').notEmpty();
  var errors = req.validationErrors();

  if(errors && !req.body.name){
    console.log('line 16: need a name please');
    res.redirect('/login');
  } else if (req.body.name){
  req.session.name = req.body.name;

  res.redirect('/mysteryWord');
  }
}
};
