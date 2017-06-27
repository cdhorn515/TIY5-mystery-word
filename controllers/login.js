// 
//
// module.exports = {
//   app.get('/login', function(req, res) {
//
//     res.render('login', context);
//   },
//
//   app.post('/login', function(req, res) {
//     req.checkBody('name', 'Please enter your name').notEmpty();
//     var errors = req.validationErrors();
//     var context = {};
//
//     if(!req.body.name){
//       console.log('line 226: please enter your name');
//   }
//     if(errors){
//        context = {
//         errors: errors
//       };
//       res.render('login', context);
//     } else if (req.body.name){
//     req.session.name = req.body.name;
//
//     res.redirect('mysteryWord');
//   }
//
//
// });
