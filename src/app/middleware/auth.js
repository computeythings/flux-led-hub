"use strict"
const passport = require('passport');
const CustomStrategy = require('passport-custom');

const config = require('../controllers/config.js');

// Validate requests via API key
passport.use('apikey', new CustomStrategy((req, done) => {
  if (!req.body.access_token)
    return done(new Error('This method requires an API key.'));
  if(!config.authenticate(req.body.access_token))
    return done(new Error('Invalid API key.'));
  return(null, true);
}));
