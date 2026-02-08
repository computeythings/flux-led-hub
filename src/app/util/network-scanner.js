"use strict"
var dgram = require('dgram');
var events = require('events');
var server;
// These constants are predefined and correspond to Flux LED hardware
const DISCOVERY_PORT = 48899;
const BROADCAST_ADDR = '255.255.255.255';
const DISCOVER_MSG = 'HF-A11ASSISTHREAD';
const DISCOVERY_TIMEOUT = 5000; // Increased to 5 seconds
const BROADCAST_INTERVAL = 500; // Broadcast every 500ms
var timeout; //stores Timeout object

module.exports.discover = function() {
  server = dgram.createSocket('udp4');
  var emitter = new events.EventEmitter();
  var devices = [];
  var self;
  var broadcastCount = 0;
  var maxBroadcasts = Math.floor(DISCOVERY_TIMEOUT / BROADCAST_INTERVAL);
  
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
      if(msg.toString() != DISCOVER_MSG) { // This should filter out localhost
          devices.push(rinfo.address);
          console.log(`Added ${rinfo.address} to devices`);
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
  });
  
  // Broadcast multiple times over the discovery period
  const broadcastInterval = setInterval(() => {
    broadcastCount++;
    broadcast();
    
    if (broadcastCount >= maxBroadcasts) {
      clearInterval(broadcastInterval);
      // Final timeout to allow last responses to come in
      setTimeout(() => {
        try {
          server.close();
        } catch (ignore) {}
      }, 1000);
    }
  }, BROADCAST_INTERVAL);
  
  return emitter;
}

function broadcast() {
  server.send(Buffer.from(DISCOVER_MSG), 0, DISCOVER_MSG.length, DISCOVERY_PORT,
    BROADCAST_ADDR, (err) => {
      if (err) {
        console.log(`Broadcast error: ${err.message}`);
      }
    });
}