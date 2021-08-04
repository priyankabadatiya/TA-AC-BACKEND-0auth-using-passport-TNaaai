var express = require('express');
var router = express.Router();
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session,req.user)
  res.send('respond with a resource');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/logIn', (req, res) => {
  res.render('logIn');
});

router.post('/register', (req, res, next) => {
  console.log(req.body)
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    res.redirect('/users/logIn');
  })
});

router.post('/logIn', (req, res, next) => {
  let {email, password} = req.body;
  if(!email || !password) {
    res.redirect('/users/logIn');
  }
  User.findOne({email}, (err, user) => {
    if(err) return next(err);
    if(!user) {
      res.redirect('/users/logIn');
    }
   
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
        res.redirect('/users/logIn');
      }
      req.session.userID = user.id;
      res.redirect('/success');
    })
  })
});
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
module.exports = router;
