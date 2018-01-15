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
const dns = require('dns');

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

function clientUpdate(msg, data) {
  io.sockets.emit(msg, data);
}

function addLight(ipaddr, name) {
  var jsonConfig = JSON.parse(fs.readFileSync(CONFIG));
  jsonConfig.lights[ipaddr] = ipaddr;
  devices.list[ipaddr] = new controller.WifiLedBulb(ipaddr,
    clientUpdate, name || ipaddr);

  var newFile = JSON.stringify(jsonConfig, null, 4);

  fs.writeFileSync(CONFIG, newFile, "utf8", (err) => {
    if(err){
      console.log('Failed to write');
    } else {
      console.log('Light ' + ipaddr + 'added');
    }
  });
  clientUpdate('newbulb', devices.list[ipaddr].state());
}

function scanTo(response) {
  var scanner = new require('./app/scanner');
  scanner.discover().on('scanComplete', (data) => {
    console.log(JSON.stringify(data));
    response.end(JSON.stringify(data));
  });
}

//
// ROUTING
//
app.get('*', (req,res) => {
  console.log('GET ' + req.url);

  if(req.url == '/') {
    const props = {
      apikey: apikey,
      bulbs: devices.getDevices()
    };
    const html = ReactDOMServer.renderToString(
      React.createElement(require('./components/Layout.jsx'), props)
    );
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Invalid Link!');
  }
});

app.post('*', (req,res) => {
  console.log('POST ' + req.url);

  if(req.body.access_token === apikey) {
    switch(req.url) {
      case '/api/on':
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(devices.lightsOn(req.body.target));
        break;
      case '/api/off':
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(devices.lightsOff(req.body.target));
        break;
      case '/api/toggle':
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(devices.toggleLights(req.body.target));
        break;
      case '/api/brightness':
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(devices.setBrightness(req.body.target, req.body.brightness));
        break;
      case '/api/scan':
        res.writeHead(200, {'Content-Type': 'text/plain'});
        scanTo(res);
        break;
      case '/api/add':
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(addLight(req.body.ipaddr));
      default:
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Invalid Link!');
    }
  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('Invalid API Key\n');
  }
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
    let devName = lights[key];
    dns.lookup(key, (err, addr, fam) => { // resolve any hostnames to IP
      devices.list[addr] = new controller.WifiLedBulb(addr,
        clientUpdate, devName);
    });
  }

  server.listen(app.get('port'), listenIP, () => {
      console.log('Listening at http://localhost:' + app.get('port'));
  });
}

startServer();
