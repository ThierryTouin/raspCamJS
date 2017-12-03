var express = require('express');
var router = express.Router();
var passport = require('passport');


// Define routes.
router.get('/',
function(request, response) {
    response.render('home.ejs', { user: request.user });
});

router.get('/login',
function(request, response){
    response.render('login.ejs');
});

router.post('/login', 
passport.authenticate('local', { failureRedirect: 'login.ejs' }),
function(request, response) {
    response.redirect('/');
});

router.get('/logout',
function(request, response){
    request.logout();
  response.redirect('/');
});

router.get('/profile',
require('connect-ensure-login').ensureLoggedIn(),
function(request, response){
    response.render('profile.ejs', { user: request.user });
});

router.get('/about',
require('connect-ensure-login').ensureLoggedIn(),
function(request, response){
    response.render('about.ejs', { user: request.user });
});



module.exports = router;