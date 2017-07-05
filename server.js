'use strict'
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
var port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Setup lights to be controlled here
const controller = require('./app/controller');

var b1 = require('net').Socket();
var b2 = require('net').Socket();
var b3 = require('net').Socket();

b1.connect(5577, 'bulb1');
b2.connect(5577, 'bulb2');
b3.connect(5577, 'bulb3');

function lightsOn() {
  controller.turnOn(b1);
  controller.turnOn(b2);
  controller.turnOn(b3);
}

function lightsOff() {
  controller.turnOff(b1);
  controller.turnOff(b2);
  controller.turnOff(b3);
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

app.listen(port);
console.log('Listening at http://localhost:' + port);
