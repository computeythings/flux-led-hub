/*
  This test should verify a valid .env file and connect to every bulb
*/
'use strict'
const controller = require('../app/controller');
const env = require('node-env-file');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

var port;
var lights;
var devices = [];

function init() {
  env('.env'); // parse environment variables from .env file

  port = process.env.PORT;
  lights = process.env.BULBS.split(' ');

  for (var i = 0; i < lights.length; i++) {
    devices.push(new controller.WifiLedBulb(lights[i]));
  }

  app.listen(port);
  console.log('Listening at http://localhost:' + port);
}

init();
