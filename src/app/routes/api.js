"use strict"
const passport = require('passport');
const express = require('express');
const router = express.Router();

const scanner = require('../util/network-scanner.js');
const WifiLedBulbs = require('../controllers/lightbulbs.js');
const lightbulbs = new WifiLedBulbs();

router.post('*', (req,res,next) => {
  console.log('POST:', req.url);
  return next();
});

router.post('/api/*', passport.authenticate('apikey', {
  session: false
}), (req, res) => {
  switch (req.url) {
    case '/api/on':
      res.status(202).type('text/plain').send(
        lightbulbs.lightsOn(req.body.target)
      );
      break;

    case '/api/off':
      res.status(202).type('text/plain').send(
        lightbulbs.lightsOff(req.body.target)
      );
      break;

    case '/api/toggle':
      res.status(202).type('text/plain').send(
        lightbulbs.toggleLights(req.body.target)
      );
      break;

    case '/api/brightness':
      res.status(202).type('text/plain').send(
        lightbulbs.setBrightness(req.body.target, req.body.brightness)
      );
      break;

    case '/api/ww':
      res.status(202).type('text/plain').send(
        lightbulbs.setWarmWhite(req.body.target)
      );
      break;

    case '/api/color':
      res.status(202).type('text/plain').send(
        lightbulbs.setColor(req.body.target, req.body.colorValue)
      );
      break;

    case '/api/scan':
      scanner.discover().on('scanComplete', data => {
        console.log(data);
        res.status(202).json(data);
      });
      break;

    case '/api/add':
      lightbulbs.addLight(req.body.ipaddr, req.body.name).then(msg => {
        res.status(202).type('text/plain').send(msg);
      }).catch(err => {
        res.status(500).type('text/plain').send(err.message);
      })
      break;
    default:
      res.status(404).type('text/plain').send('Invalid URL');
  }
});


module.exports = router;
