const ping = require('ping');

// Some magic numbers here as we're dealing directly with a bytestream
// - blame Flux for not having an actual API
const NULL_STATE = 0;
const ON_STATE = 35;
const OFF_STATE = 36;
const POWER_ON = [0x71, 0x23, 0x0f, 0xa3];
const POWER_OFF = [0x71, 0x24, 0x0f, 0xa4];
const REFRESH_STATE = [0x81, 0x8a, 0x8b, 0x96];
const POWER_CHUNK = 2;
const KEEPALIVE_INTERVAL = 5000; // time in ms

module.exports.WifiLedBulb = function (ipaddr, updateCallback) {
    var self = this;
    this.update = updateCallback;
    this.name = '';
    this.ipaddr = ipaddr;
    this.powerState = NULL_STATE;
    this.socket = require('net').Socket();

    this.socket.connect(5577, ipaddr)
    .on('connect', () => refreshState(self.socket)) // to trigger data to get initial state
    .on('data', (chunk) => {
      var powerByte = chunk[POWER_CHUNK];
      if(powerByte == ON_STATE && powerByte != self.powerState) {
        self.powerState = ON_STATE;
        console.log('[' + new Date().toLocaleString() + '] ' +
          self.ipaddr + ' - ON');
          self.update({ bulb: self.ipaddr, powerState: self.powerState});
      }
      else if(powerByte == OFF_STATE && powerByte != self.powerState) {
        self.powerState = OFF_STATE;
        console.log('[' + new Date().toLocaleString() + '] ' +
          self.ipaddr + ' - OFF');
          self.update({ bulb: self.ipaddr, powerState: self.powerState});
      }
    })
    .on('close', (had_error) => {
      console.log('Refreshing socket ' + self.ipaddr);
      self.powerState = NULL_STATE;
      self.update({ bulb: self.ipaddr, powerState: self.powerState});
      self.socket.connect(5577, self.ipaddr);
    })
    .on('error', () => {
      console.log('[' + new Date().toLocaleString() + '] ' +
        'Failed to connect to ' + self.ipaddr);
    });

    // This checks if bulbs are active ever
    setInterval(() => {
      ping.sys.probe(this.ipaddr, (isAlive) => {
        if(!isAlive) {
          self.socket.destroy();
        }
      });
    }, KEEPALIVE_INTERVAL);
}

exports.WifiLedBulb.prototype = {
  turnOn: function() {
    var buffer = new Buffer(POWER_ON);
    this.socket.write(buffer);
  },
  turnOff: function() {
    var buffer = new Buffer(POWER_OFF);
    this.socket.write(buffer);
  },
  setBrightness: function(level) {
    if(level > 100 || level < 0)
      return false;
    var brightness = parseInt((level * 255)/100);
    var postfix = (0x4f + brightness) & 0xff;
    var buffer =  new Buffer([0x31, 0x00, 0x00, 0x00, brightness, 0x0f, 0x0f,
      postfix]);
    this.socket.write(buffer);
  },
  state: function() {
    return { bulb: this.ipaddr, powerState: this.powerState}
  },
  isOn: function() {
    return this.powerState === ON_STATE;
  }
};

function refreshState(socket) {
  var buffer = new Buffer(REFRESH_STATE);
  socket.write(buffer);
}
