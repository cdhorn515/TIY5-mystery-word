
module.exports = {

landing: function(req, res) {
var context = {};
req.session.name = '';
req.session.word = '';
  res.render('login', context);
},

checkForName: function(req, res) {
  // req.checkBody('name', 'Please enter your name').notEmpty();
  // var errors = req.validationErrors();
  // var context = {};

  if(!req.body.name){
    console.log('line 102: please enter your name');
    res.redirect('/login');
// }
//   if(errors){
//      context = {
//       msg: 'please enter your name'
//     };
//     res.render('login', context);
  } else if (req.body.name){
  req.session.name = req.body.name;

  res.redirect('/mysteryWord');
  }
}
};
