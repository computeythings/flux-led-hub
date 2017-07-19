const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const DISCOVERY_PORT = 48899;
const BROADCAST_ADDR = '255.255.255.255';
const DISCOVER_MSG = 'HF-A11ASSISTHREAD';

var timeout; //stores Timeout object

function discover() {
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
      }
      
      clearTimeout(timeout); // timeout is reset upon finding each new device
      broadcast(); // re-broadcasting makes results more reliable
      console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    }
  });

  server.on('listening', () => {
    self = server.address();
    console.log(`server listening ${self.address}:${self.port}`);
  });

  server.on('close', () => {
    console.log('finished listening\n' + devices);
  })

  broadcast();
}

function broadcast() {
  server.send(new Buffer(DISCOVER_MSG), 0, DISCOVER_MSG.length, DISCOVERY_PORT,
    BROADCAST_ADDR, () => {
      timeout = setTimeout(() => server.close(), 5000);
    });
}



discover();
