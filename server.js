"use strict";

//require('daemon')();

var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var session = require('express-session');

const errorLog = require('./util/logger').errorlog;
const successlog = require('./util/logger').successlog;

// Moteur de template
app.set('view engine', 'ejs');

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});



// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views/pages');
app.set('view engine', 'ejs');

// Middleware
app.use('/assets', express.static('public'))

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());



// Routes ======================================================================
app.use('/', require('./routes'));

// Camera ======================================================================
var http = require('http').Server(app);
var io = require('socket.io')(http);

var serverCam = require('./util/cam.js');

serverCam.connection(io);
  
//http.listen(3000, serverCam.listenDebug(io));
http.listen(3000, serverCam.listen(io));

successlog.info(`Server started on port 3000`);