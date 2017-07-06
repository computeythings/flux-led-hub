'use strict'
const controller = require('./app/controller');
const env = require('node-env-file');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Globals
var devices = [];
var port;
var lights;

function lightsOn() {
  for(var i = 0; i < devices.length; i++) {
    devices[i].turnOn();
  }
}

function lightsOff() {
  for(var i = 0; i < devices.length; i++) {
    devices[i].turnOff();
  }
}

app.get('/', (req,res) => {
  console.log('GET /');

  var html = fs.readFileSync('public/index.html');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
});

app.post('/api/on/', (req,res) => {
  console.log('POST /api/on/');
  lightsOn();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('turning on lights');
});

app.post('/api/off/', (req,res) => {
  console.log('POST /api/off/');
  lightsOff();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('turning off lights');
});


/*
  Main function run when server is started
*/
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
