// app.get('/login', function(req, res) {
// var context = {};
// req.session.name = '';
// req.session.word = '';
//   res.render('login', context);
// });
//
// app.post('/login', function(req, res) {
//   req.checkBody('name', 'Please enter your name').notEmpty();
//   var errors = req.validationErrors();
//   var context = {};
//
//   if(!req.body.name){
//     console.log('line 102: please enter your name');
// }
//   if(errors){
//      context = {
//       errors: errors
//     };
//     res.render('login', context);
//   } else if (req.body.name){
//   req.session.name = req.body.name;
//
//   res.redirect('mysteryWord');
// }
// });
//
// app.get('/playAgain', function(req, res){
//   req.session.word = '';
//   res.redirect('mysteryWord');
// });
//
// app.post('/end', function(req,res){
//
//   var context = {
//   endGame: 'Thanks  for playing ' + req.session.name + '! Hope you\'ll come back and play again soon!'
//   };
//   res.render('index', context);
// });
//
