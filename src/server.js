require('babel-register')({
    presets: ['react']
});

const keygen = require('./app/keygen.js');
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const controller = require('./app/controller');
const devices = require('./app/devicemanager');

const CONFIG = path.resolve(__dirname, 'config/config.json');
const config = require(CONFIG);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.disable('x-powered-by'); // security restritcion

// Globals
var port;
var lights;
var apikey;

// Socket.io stuff for async transactions between server and clientrc/app/
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('new connection')
  clientRefresh(socket);
});

function clientRefresh(socket) {
  for(var key in devices.list) {
    socket.emit('update', devices.list[key].state());
  }
}

function clientUpdate(data) {
  io.sockets.emit('update', data);
}

//
// ROUTING
//
app.get('/', (req,res) => {
  console.log('GET /');
  const props = {
    apikey: apikey,
    bulbs: devices.getDevices()
  };
  const html = ReactDOMServer.renderToString(
    React.createElement(require('./components/Layout.jsx'), props)
  );
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
});

app.post('/api/on/', (req,res) => {
  console.log('POST /api/on/');
  if(req.body.access_token === apikey) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(devices.lightsOn(req.body.target));
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
});

app.post('/api/off/', (req,res) => {
  console.log('POST /api/off/');
  if(req.body.access_token === apikey) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(devices.lightsOff(req.body.target));
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
});

app.post('/api/toggle', (req,res) => {
  console.log('POST /api/toggle/');
  if(req.body.access_token === apikey) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(devices.toggleLights(req.body.target));
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
});

app.post('/api/brightness', (req,res) => {
  console.log('POST /api/brightness/');
  if(req.body.access_token === apikey) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(devices.setBrightness(req.body.target, req.body.brightness));
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
})

app.post('/api/scan', (req,res) => {
  console.log('POST /api/scan/');
  if(req.body.access_token === apikey) {
    var scanner = new require('./app/scanner');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    scanner.discover().on('scanComplete', (data) => {
      console.log(JSON.stringify(data));
      res.end(JSON.stringify(data));
    });
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
});

app.get('*', (req, res) => {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('Invalid Link!');
});

// This will only be run when the APIKEY line in config.json is empty
function setAPIKey() {
  var newKey = keygen.apikey(26); // 26 character API key
  console.log('generated API key: ' + newKey);

  var jsonConfig = JSON.parse(fs.readFileSync(CONFIG));
  jsonConfig.apikey = newKey;

  var newFile = JSON.stringify(jsonConfig, null, 4);

  fs.writeFileSync(CONFIG, newFile, "utf8", function(err) {
    if(err){
      console.log('Failed to write');
    } else {
      console.log('API Key Saved!');
    }
  });

  return newKey;
}

function addLight(ipaddr) {
  var jsonConfig = JSON.parse(fs.readFileSync(CONFIG));
  jsonConfig.lights.push(ipaddr);
  devices.list[ipaddr] = new controller.WifiLedBulb(ipaddr,
    clientUpdate);

  var newFile = JSON.stringify(jsonConfig, null, 4);

  fs.writeFileSync(CONFIG, newFile, "utf8", function(err) {
    if(err){
      console.log('Failed to write');
      return false;
    } else {
      console.log('Light ' + ipaddr + 'added');
      return true;
    }
  });
}

/*
  Main function run when server is started
*/
function startServer() {
  app.set('port', config.port);

  // generate API key if one does not exist
  apikey = config.apikey || setAPIKey();
  lights = config.lights;
  var listenIP = config.listen || 8000;

  // Create usable WifiLedBulb objects from each light given in config
  for (var key in lights) {
    devices.list[lights[key]] = new controller.WifiLedBulb(lights[key],
      clientUpdate);
  }

  server.listen(app.get('port'), listenIP, () => {
      console.log('Listening at http://localhost:' + app.get('port'));
  });
}

startServer();
