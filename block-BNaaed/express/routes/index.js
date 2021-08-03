var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session, req.user);
  res.render('index', { title: 'Express' });
});

//render success page
router.get('/success', (req, res) => {
  res.render('success');
});

//render login failure page
router.get('/failure', (req, res) => {
  res.render('failure');
});

//connect to github
router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/failure'}), (req, res) => {
  res.redirect('/success');
});

module.exports = router;
