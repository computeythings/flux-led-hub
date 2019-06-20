"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();

const lightbulbs = require('../controllers/lightbulbs.js');

router.post('*', (req,res,next) => {
  console.log('POST:', req.url);
  next();
});

router.post('/api', passport.authenticate('apikey'), (req, res) => {
  switch(req.url) {
    case '/api/on':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(devices.lightsOn(req.body.target));
      break;
    case '/api/off':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(devices.lightsOff(req.body.target));
      break;
    case '/api/toggle':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(devices.toggleLights(req.body.target));
      break;
    case '/api/brightness':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(devices.setBrightness(req.body.target, req.body.brightness));
      break;
    case '/api/ww':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(devices.setWarmWhite(req.body.target));
      break;
    case '/api/color':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(devices.setColor(req.body.target, req.body.colorValue));
      break;
    case '/api/scan':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      scanTo(res);
      break;
    case '/api/add':
      res.writeHead(202, {'Content-Type': 'text/plain'});
      res.end(addLight(req.body.ipaddr));
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Invalid Link!');
  }
});

module.exports = router;
