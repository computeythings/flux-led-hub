var exports = module.exports = {};


// Some magic numbers here as we're dealing directly with a bytestream
// - blame Flux for not having an actual API
const NULL_STATE = 0;
const ON_STATE = 35;
const OFF_STATE = 36;
const POWER_ON = [0x71, 0x23, 0x0f, 0xa3];
const POWER_OFF = [0x71, 0x24, 0x0f, 0xa4];
const REFRESH_STATE = [0x81, 0x8a, 0x8b, 0x96];
const POWER_CHUNK = 2;

exports.WifiLedBulb = function (ipaddr) {
    this.ipaddr = ipaddr;
    this.powerState = NULL_STATE;
    this.socket = require('net').Socket().setTimeout(3000);
    this.socket.connect(5577, ipaddr)
    .on('data', (chunk) => {
      var powerByte = chunk[POWER_CHUNK];
      if(powerByte == ON_STATE && powerByte != this.powerState) {
        this.powerState = ON_STATE;
        console.log('[' + new Date().toLocaleString() + '] ' +
          this.ipaddr + ' - ON');
      }
      else if(powerByte == OFF_STATE && powerByte != this.powerState) {
        this.powerState = OFF_STATE;
        console.log('[' + new Date().toLocaleString() + '] ' +
          this.ipaddr + ' - OFF');
      }
    })
    .on('disconnect', function() {
      console.log('[' + new Date().toLocaleString() + '] ' +
        'disconnected from bulb ' + this.ipaddr);
      this.powerState = NULL_STATE;
    })
    .on('error', function() {
      console.log('[' + new Date().toLocaleString() + '] ' +
        'failed to connect to ' + this.ipaddr);
      this.powerState = NULL_STATE;
    });
    refreshState(this.socket); // to trigger data to get initial state
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
  isOn: function() {
    return this.powerState === ON_STATE;
  }
};

refreshState = function (socket) {
  var buffer = new Buffer(REFRESH_STATE);
  socket.write(buffer);
}
