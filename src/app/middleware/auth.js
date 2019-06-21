"use strict"
const passport = require('passport');
const CustomStrategy = require('passport-custom');

const config = require('../controllers/config.js');
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
// Validate requests via API key
passport.use('apikey', new CustomStrategy((req, done) => {
  if (!req.body.access_token)
    return done(new Error('This method requires an API key.'));
  if(!config.validate(req.body.access_token))
    return done(new Error('Invalid API key.'));
  return done(null, true);
}));
