var exports = module.exports = {};

exports.WifiLedBulb = function (ipaddr) {
    this.ipaddr = ipaddr;
    this.powerState = 0;
    this.socket = require('net').Socket();
    this.socket.connect(5577, ipaddr)
    .on('data', (chunk) => {
    // Some magic numbers here as we're dealing directly with a bytestream
    // - blame Flux for not having an actual API
      var powerByte = chunk[2];
      if(powerByte == 35 && powerByte != this.powerState) {
        this.powerState = 35;
        console.log('[' + new Date().toLocaleString() + '] ' +
          this.ipaddr + ' - ON');
      }
      else if(powerByte == 36 && powerByte != this.powerState) {
        this.powerState = 36;
        console.log('[' + new Date().toLocaleString() + '] ' +
          this.ipaddr + ' - OFF');
      }
    })
    .on('error', function() {
      console.log('[' + new Date().toLocaleString() + '] ' + 
        'disconnected from ' + this.ipaddr);
      this.powerState = 0;
    });
    refreshState(this.socket); // to trigger data to get initial state
}

exports.WifiLedBulb.prototype = {
  turnOn: function() {
    var buffer = new Buffer([0x71, 0x23, 0x0f, 0xa3]);
    this.socket.write(buffer);
  },
  turnOff: function() {
    var buffer = new Buffer([0x71, 0x24, 0x0f, 0xa4]);
    this.socket.write(buffer);
  }
};

refreshState = function (socket) {
  var buffer = new Buffer([0x81, 0x8a, 0x8b, 0x96]);
  socket.write(buffer);
}
