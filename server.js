'use strict'
const controller = require('./app/controller');
const keygen = require('./build/Release/keygen');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config.json');

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

// This will only be run when the APIKEY line in .env is empty
function setAPIKey() {
  var newKey = keygen.apikey(26); // 26 character API key
  console.log('generated API key: ' + newKey);

  var jsonConfig = JSON.parse(fs.readFileSync('./config.json'));
  jsonConfig.apikey = newKey;

  // Using replacer to format properly
  var newFile = JSON.stringify(jsonConfig, null, 4);

  fs.writeFileSync('./config.json', newFile, "utf8", function(err) {
    if(err){
      console.log('Failed to write');
    } else {
      console.log('API Key Saved!');
    }
  });

  return newKey;
}

function lightsOn() {
  for(var bulb in devices) {
    devices[bulb].turnOn();
  }
  return 'turning on ' + lights.length + ' lights\n'
}

function lightsOff() {
  for(var bulb in devices) {
    devices[bulb].turnOff();
  }
  return 'turning off ' + lights.length + ' lights\n'
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
  return allOn ? lightsOff():lightsOn();
}

//
// ROUTING
//
app.get('/', (req,res) => {
  console.log('GET /');
  var html = fs.readFileSync('public/index.html');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
});

app.post('/api/on/', (req,res) => {
  console.log('POST /api/on/');
  if(req.body.access_token === apikey) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(lightsOn());
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
});

app.post('/api/off/', (req,res) => {
  console.log('POST /api/off/');
  if(req.body.access_token === apikey) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(lightsOff());
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
});

app.post('/api/toggle', (req,res) => {
  console.log('POST /api/toggle/');
  if(req.body.access_token === apikey) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(toggleLights());
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
});

app.get('*', (req, res) => {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('Invalid Link!');
});

/*
  Test function for parsing test arguments
*/
function runTest(test) {
  switch(test) {
    case 'on':
      console.log('Turning on lights.');
      lightsOn();
      break;
    case 'off':
      console.log('Turning off lights.');
      lightsOff();
      break;
    case 'toggle':
      console.log('Toggling lights.');
      toggleLights();
      break;
    case 'apikey':
      console.log('Generated new API key: ' + setAPIKey());
      break;
    default:
      console.log('No test found matching: ' + test);
  }
}

/*
  Main function run when testing is started
*/
function startTesting(tests) {
  const testHelp = 'Usage: node server.js test <options>\n' +
                      '\ton: turn all lights on\n' +
                      '\toff: turn all lights off\n' +
                      '\ttoggle: toggle all lights\n' +
                      '\tapikey: generate new API Key in config.json file. ' +
                      'CAUTION: this will overwrite your existing key.\n';
  if(tests.length == 0 || tests == 'help') {
    console.log(testHelp);
    return;
  }

  lights = config.lights;
  for (var bulb in lights) {
    devices.push(new controller.WifiLedBulb(lights[bulb]));
  }

  console.log('Attempting to run tests');
  var i;
  for(i = 0; i < tests.length; i++) {
    setTimeout(runTest, 3000*(i+1), tests[i]);
  }
  setTimeout(function(){
    for(var bulb in devices)
      devices[bulb].socket.destroy();
  }, 3000*(++i));
  setTimeout(process.exit, 3000*(++i));
}

/*
  Main function run when server is started
*/
function startServer() {
  // generate API key if one does not exist
  apikey = config.apikey || setAPIKey();
  lights = config.lights;
  var port = config.port;
  var listenIP = config.listen;

  // Create usable WifiLedBulb objects from each light given in config
  for (var bulb in lights) {
    devices.push(new controller.WifiLedBulb(lights[bulb]));
  }

  console.log('Listening at http://localhost:' + port);
  return app.listen(port, listenIP);
}

var runType = process.argv.slice(2,3);
if(runType == 'server') {
    startServer();
}
else if(runType == 'test') {
  startTesting(process.argv.slice(3));
}
else if(runType == 'run') {
  setAPIKey();
}
