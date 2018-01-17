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
const RED_CHUNK = 6;
const GREEN_CHUNK = 7;
const BLUE_CHUNK = 8;
const BRIGHTNESS_CHUNK = 9;
const KEEPALIVE_INTERVAL = 5000; // time in ms

module.exports.WifiLedBulb = function (ipaddr, updateCallback, name) {
    var self = this;
    this.update = updateCallback;
    this.name = name;
    this.ipaddr = ipaddr;
    this.powerState = NULL_STATE;
    this.brightness = 0;
    this.RGB = [0,0,0]; // This is the current RGB value of the bulb
    this.colorBrightest = [255,255,255]; // This is the cached color of the bulb
    this.isColor = false;
    this.socket = require('net').Socket();

    this.socket.connect(5577, ipaddr)
    .on('connect', () => refreshState(self.socket)) // to trigger data to get initial state
    .on('data', (chunk) => {
      var powerByte = chunk[POWER_CHUNK];
      if(powerByte == ON_STATE && powerByte != self.powerState) {
        self.powerState = ON_STATE;
        console.log('[' + new Date().toLocaleString() + '] ' +
          self.ipaddr + ' - ON');
          self.update('update', { bulb: self.ipaddr, powerState: self.powerState});
      }
      else if(powerByte == OFF_STATE && powerByte != self.powerState) {
        self.powerState = OFF_STATE;
        console.log('[' + new Date().toLocaleString() + '] ' +
          self.ipaddr + ' - OFF');
          self.update('update', { bulb: self.ipaddr, powerState: self.powerState});
      }

      var r = chunk[RED_CHUNK];
      var g = chunk[GREEN_CHUNK];
      var b = chunk[BLUE_CHUNK];
      self.RGB = [r,g,b];

      var brightnessByte = chunk[BRIGHTNESS_CHUNK];
      if(r == 0 && g == 0 && b == 0) {
        self.brightness = parseInt((brightnessByte / 255)*100);
        self.isColor = false;
      } else {
        self.isColor = true;
        var rgbMax = Math.max.apply(Math, self.RGB);
        if(rgbMax > 0)
          var maxBrightness = 255/rgbMax;
        else
          var maxBrightness = 255/1;

        self.colorBrightest = [
          parseInt(self.RGB[0]*maxBrightness),
          parseInt(self.RGB[1]*maxBrightness),
          parseInt(self.RGB[2]*maxBrightness)
        ];
        self.brightness = parseInt((rgbMax / 255)*100);
      }
    })
    .on('close', (had_error) => {
      console.log('[' + new Date().toLocaleString() + '] ' +
        'Refreshing socket ' + self.ipaddr);
      self.powerState = NULL_STATE;
      self.update('update', { bulb: self.ipaddr, powerState: self.powerState});
      self.socket.connect(5577, self.ipaddr);
    })
    .on('error', () => {
      console.log('[' + new Date().toLocaleString() + '] ' +
        'Failed to connect to ' + self.ipaddr);
    });

    // This checks if bulbs are active every [KEEPALIVE_INTERVAL]
    setInterval(() => {
      if(this.powerState != NULL_STATE)  {
        ping.sys.probe(this.ipaddr, (isAlive) => {
          if(!isAlive) {
            console.log('[' + new Date().toLocaleString() + '] ' +
              self.ipaddr + ' - DISCONNECTED');
            self.socket.destroy();
          } else {
            refreshState(self.socket);
          }
        });
      }
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
    // adjust for inappropriate values
    if(level > 100)
      level = 100;
    if(level < 0)
      level = 0;

    if(this.isColor) {
      this.setColorBrightness(level);
    }
    else {
      this.setWarmWhite(level);
    }
  },
  setColor: function(red, green, blue) {
    // adjust for inappropriate
    if(red > 255)
      red = 255;
    if(green > 255)
      green = 255;
    if(blue > 255)
      blue = 255;
    if(red < 0)
      red = 0;
    if(green < 0)
      green = 0;
    if(blue < 0)
      blue = 0;

    var postfix = (0x130 + red+green+blue) & 0xff;
    var buffer =  new Buffer([0x31, red, green, blue, 0x00, 0xf0, 0x0f,
      postfix]);
    this.colorBrightest = [red,green,blue];
    this.socket.write(buffer);
  },
  setColorBrightness: function(level) {
    if(level > 0) {
      var adjustment = level/100;

      var red = parseInt(this.colorBrightest[0]*adjustment);
      var green = parseInt(this.colorBrightest[1]*adjustment)
      var blue = parseInt(this.colorBrightest[2]*adjustment);

      var postfix = (0x130 + red+green+blue) & 0xff;
      var buffer =  new Buffer([0x31, red, green, blue, 0x00, 0xf0, 0x0f,
        postfix]);
      this.socket.write(buffer);
    } else {
      var postfix = (0x130 + 0+0+0) & 0xff;
      var buffer =  new Buffer([0x31, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x0f,
        postfix]);
      this.socket.write(buffer);
    }
    this.brightness = level;
    this.update({ bulb: this.ipaddr, brightness: this.brightness});
  },
  setWarmWhite: function(level) {
    if(level > 100 || level < 0)
      return false;
    var brightness = parseInt((level * 255)/100);
    var postfix = (0x4f + brightness) & 0xff;
    var buffer =  new Buffer([0x31, 0x00, 0x00, 0x00, brightness, 0x0f, 0x0f,
      postfix]);
    this.brightness = level;
    this.update({ bulb: this.ipaddr, brightness: this.brightness});
    this.socket.write(buffer);
  },
  state: function() {
    return {
      ipaddr: this.ipaddr,
      name: this.name,
      powerState: this.powerState,
      brightness: this.brightness
    }
  },
  isOn: function() {
    return this.powerState === ON_STATE;
  }
};

function refreshState(socket) {
  var buffer = new Buffer(REFRESH_STATE);
  socket.write(buffer);
}
