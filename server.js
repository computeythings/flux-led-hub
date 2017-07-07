'use strict'
const controller = require('./app/controller');
const keygen = require('./build/Release/keygen');
const env = require('node-env-file');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

// Globals
var devices = [];
var port;
var lights;
var apikey;

function setAPIKey() {
  var newKey = keygen.apikey(26); // 26 character API key

  var envData = fs.readFileSync('.env').toString().split("\n");
  for(var line in envData) {
    if(envData[line] == 'APIKEY=') {
      console.log('\nwriting new API key to file: ' + newKey);
      envData[line] = envData[line].concat(newKey);
    }
  }
  var newEnv = envData.join("\n");
  fs.writeFileSync('.env', newEnv, { flag: 'w' },function(err) {
    if(err) console.log('Failed to write');
    else console.log('API Key Saved!');
  });

  return newKey;
}

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

/*
  Turns on all lights if a single bulb is on
  or turns all lights off if every bulb is on
*/
function toggleLights() {
  var allOn = true;
  for(var i = 0; i < devices.length; i++) {
    if(!devices[i].isOn()) {
      allOn = false;
    }
  }
  // Always find an excuse to use the ternary operator
  allOn ? lightsOff():lightsOn();
}

app.get('/', (req,res) => {
  console.log('GET /');
  var html = fs.readFileSync('public/index.html');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
});

app.post('/api/on/', (req,res) => {
  console.log('POST /api/on/');
  console.log('access_token: ' + req.body.access_token);
  lightsOn();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('turning on lights\n');
});

app.post('/api/off/', (req,res) => {
  console.log('POST /api/off/');
  console.log('access_token: ' + req.body.access_token);
  lightsOff();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('turning off lights\n');
});

app.post('/api/toggle', (req,res) => {
  console.log('POST /api/toggle/');
  console.log('access_token: ' + apikey);
  toggleLights();
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('toggling lights\n');
})


/*
  Main function run when server is started
*/
function init() {if(!process.env.APIKEY)
  // parse environment variables from .env file
  env('.env', {verbose: true, overwrite: true, raise: false, logger: console});

  // generate API key if one does not exist
  port = process.env.PORT;
  lights = process.env.BULBS.split(' ');
  apikey = process.env.APIKEY || setAPIKey();

  for (var i = 0; i < lights.length; i++) {
    devices.push(new controller.WifiLedBulb(lights[i]));
  }

  app.listen(port);
  console.log('Listening at http://localhost:' + port);
}

init();
