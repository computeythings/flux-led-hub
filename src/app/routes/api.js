"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();

const lightbulbs = require('../controllers/lightbulbs.js');

router.post('*', (req,res,next) => {
  console.log('POST:', req.url);
  return next();
});

router.post('/api/*', passport.authenticate('apikey', {
  session: false }), (req, res) => {
  switch(req.url) {
    case '/api/on':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(lightbulbs.lightsOn(req.body.target));
      break;
    case '/api/off':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(lightbulbs.lightsOff(req.body.target));
      break;
    case '/api/toggle':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(lightbulbs.toggleLights(req.body.target));
      break;
    case '/api/brightness':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(lightbulbs.setBrightness(req.body.target, req.body.brightness));
      break;
    case '/api/ww':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(lightbulbs.setWarmWhite(req.body.target));
      break;
    case '/api/color':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(lightbulbs.setColor(req.body.target, req.body.colorValue));
      break;
    case '/api/scan':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      scanTo(res);
      break;
    case '/api/add':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(lightbulbs.addLight(req.body.ipaddr, req.body.name));
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Invalid Link!');
  }
});

module.exports = router;
