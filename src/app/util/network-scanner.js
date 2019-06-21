"use strict"
var dgram = require('dgram');
var events = require('events');
var server;

// These constants are predefined and correspond to Flux LED hardware
const DISCOVERY_PORT = 48899;
const BROADCAST_ADDR = '255.255.255.255';
const DISCOVER_MSG = 'HF-A11ASSISTHREAD';

var timeout; //stores Timeout object

module.exports.discover = function() {
  server = dgram.createSocket('udp4');
  var emitter = new events.EventEmitter();
  var devices = [];
  var self;
  server.bind(DISCOVERY_PORT, () => {
    server.setBroadcast(true);
  });

  server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    const deviceAddr = rinfo.address;
    if(!devices.includes(deviceAddr)){
      if(msg != DISCOVER_MSG) { // This should filter out localhost
          devices.push(rinfo.address);
          console.log(`Added ${rinfo.address} to devices`);

          clearTimeout(timeout); // timeout is reset upon finding each new device
          broadcast(); // re-broadcasting makes results more reliable
          console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
      }
    }
  });

  server.on('listening', () => {
    self = server.address();
    console.log(`server listening ${self.address}:${self.port}`);
  });

  server.on('close', () => {
    console.log('finished listening\n' + devices);
    emitter.emit('scanComplete', devices);
  })

  broadcast();
  return emitter;
}

function broadcast() {
  server.send(new Buffer(DISCOVER_MSG), 0, DISCOVER_MSG.length, DISCOVERY_PORT,
    BROADCAST_ADDR, () => {
      timeout = setTimeout(() => {
        try {
          server.close()
        } catch (ignore){};
      }, 1000);
    });
}
