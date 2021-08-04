var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session, req.user);
  res.render('index', { title: 'Express' });
});

router.get('/success', (req, res) => {
  res.render('success');
});

router.get('/failed', (req, res) => {
  res.render('failed');
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', {failedRedirect: '/failed',session:false }), (req, res) => {
  res.redirect('/success');
});

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/failed', session:false}), (req, res) => {
  res.redirect('/success');
})



module.exports = router;
