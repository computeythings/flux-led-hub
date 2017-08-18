require('babel-register')({
    presets: ['react']
});

const keygen = require('../build/Release/keygen');
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Component = require('./components/test.jsx');

const controller = require('./app/controller');
const config = require('./config/config.json');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, 'public')));
app.disable('x-powered-by'); // security restritcion

// Globals
var devices = {};
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
  for(var key in devices) {
    socket.emit('update', devices[key].state());
  }
}

function clientUpdate(data) {
  io.sockets.emit('update', data);
}


// This will only be run when the APIKEY line in config.json is empty
function setAPIKey() {
  var newKey = keygen.apikey(26); // 26 character API key
  console.log('generated API key: ' + newKey);

  var jsonConfig = JSON.parse(fs.readFileSync('./config.json'));
  jsonConfig.apikey = newKey;

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

function addLight(ipaddr) {
  var jsonConfig = JSON.parse(fs.readFileSync('./config.json'));
  jsonConfig.lights.push(ipaddr);
  devices[ipaddr] = new controller.WifiLedBulb(ipaddr,
    clientUpdate);

  var newFile = JSON.stringify(jsonConfig, null, 4);

  fs.writeFileSync('./config.json', newFile, "utf8", function(err) {
    if(err){
      console.log('Failed to write');
      return false;
    } else {
      console.log('Light ' + ipaddr + 'added');
      return true;
    }
  });
}

function lightsOn(targets) {
  if(targets === 'all') {
    var i = 0;
    for(var key in devices) {
      devices[key].turnOn();
      i++;
    }
    return 'turning on ' + i + ' lights\n';
  }

  for(var ip in targets) {
    if(targets[ip] in devices)
      devices[targets[ip]].turnOn();
  }
  return 'turning on ' + targets.length + ' lights\n';
}

function lightsOff(targets) {
  if(targets === 'all') {
    var i = 0;
    for(var key in devices) {
      devices[key].turnOff();
      i++;
    }
    return 'turning off ' + i + ' lights\n';
  }


  for(var ip in targets) {
    if(targets[ip] in devices)
      devices[targets[ip]].turnOff();
  }
  return 'turning off ' + targets.length + ' lights\n';
}

/*
  Turns on all lights if a single bulb is on
  or turns all lights off if every bulb is on
*/
function toggleLights(targets) {
  if(targets === 'all') {
    return toggleLights(Object.keys(devices));
  }
  var allOn = true;
  for(var ip in targets) {
    if(!devices[targets[ip]].isOn()) {
      allOn = false;
    }
  }
  // Always find an excuse to use the ternary operator
  return allOn ? lightsOff(targets):lightsOn(targets);
}

function setBrightness(targets, level) {
  console.log(targets);
  if(targets === 'all') {
    var i = 0;
    for(var key in devices) {
      devices[key].setBrightness(level);
      i++;
    }
    return 'setting brightness of ' + i + ' lights to '+ level +'\n';
  }

  for(var ip in targets) {
    if(targets[ip] in devices){
      console.log('setting brightness of ' + targets[ip]);
      devices[targets[ip]].setBrightness(level);
    }
  }
  return 'setting brightness of ' + targets.length + ' lights to '+ level +'\n';
}

//
// ROUTING
//
app.get('/', (req,res) => {
  console.log('GET /');
  var props = {
    myTestProp: 'OOEEE',
    apikey: apikey
  };
  var html = ReactDOMServer.renderToString(
    React.createElement(Component, props)
  );
  //res.writeHead(200, {'Content-Type': 'text/html'});
  res.send(html);
});

app.post('/api/on/', (req,res) => {
  console.log('POST /api/on/');
  if(req.body.access_token === apikey) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(lightsOn(req.body.target));
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
});

app.post('/api/off/', (req,res) => {
  console.log('POST /api/off/');
  if(req.body.access_token === apikey) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(lightsOff(req.body.target));
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
});

app.post('/api/toggle', (req,res) => {
  console.log('POST /api/toggle/');
  if(req.body.access_token === apikey) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(toggleLights(req.body.target));
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
});

app.post('/api/brightness', (req,res) => {
  console.log('POST /api/brightness/');
  if(req.body.access_token === apikey) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(setBrightness(req.body.target, req.body.brightness));
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
})

app.post('/api/scan', (req,res) => {
  console.log('POST /api/scan/');
  if(req.body.access_token === apikey) {
    var scanner = require('./app/scanner');
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

/*
  Main function run when server is started
*/
function startServer() {
  // generate API key if one does not exist
  app.set('port', config.port);
  apikey = config.apikey || setAPIKey();
  lights = config.lights;
  var listenIP = config.listen;

  // Create usable WifiLedBulb objects from each light given in config
  for (var key in lights) {
    devices[lights[key]] = new controller.WifiLedBulb(lights[key],
      clientUpdate);
  }

  server.listen(app.get('port'), listenIP, () => {
      console.log('Listening at http://localhost:' + app.get('port'));
  });
}

startServer();
