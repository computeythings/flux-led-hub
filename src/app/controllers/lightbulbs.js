"use strict"
const dns = require('dns');

const config = require('./config.js');
const colors = require('../util/colorkeys.js');
const WifiLedBulb = require('../model/lightbulb.js');

module.exports = class WifiLedBulbs {
  constructor() {
    this.list = {};
    let lights = config.getLights();
    for (let name in lights) {
      let deviceIP = lights[name];
      this.addLight(deviceIP, name);
    }
  }

  lightsOn(targets) {
    if(!targets) return 'No targets specified.';
    if(targets === 'all') {
      var i = 0;
      for(var key in this.list) {
        this.list[key].turnOn();
        i++;
      }
      return 'turning on ' + i + ' lights\n';
    }

    for(var ip in targets) {
      if(targets[ip] in this.list)
        this.list[targets[ip]].turnOn();
    }
    return 'turning on ' + targets.length + ' lights\n';
  }

  lightsOff(targets) {
    if(!targets) return 'No targets specified.';
    if(targets === 'all') {
      var i = 0;
      for(var key in this.list) {
        this.list[key].turnOff();
        i++;
      }
      return 'turning off ' + i + ' lights\n';
    }


    for(var ip in targets) {
      if(targets[ip] in this.list)
        this.list[targets[ip]].turnOff();
    }
    return 'turning off ' + targets.length + ' lights\n';
  }

  /*
    Turns on all lights if a single bulb is on
    or turns all lights off if every bulb is on
  */
  toggleLights(targets) {
    if(!targets) return 'No targets specified.';
    if(targets === 'all') {
      return this.toggleLights(Object.keys(this.list));
    }
    var allOn = true;
    for(var ip in targets) {
      if(!this.list[targets[ip]].isOn()) {
        allOn = false;
      }
    }
    // Always find an excuse to use the ternary operator
    return allOn ? this.lightsOff(targets):this.lightsOn(targets);
  }

  setBrightness(targets, level) {
    if(!targets) return 'No targets specified.';
    if(!level) return 'No brightness specified.';
    if(targets === 'all') {
      var i = 0;
      for(var key in this.list) {
        this.list[key].setBrightness(level);
        i++;
      }
      return 'setting brightness of ' + i + ' lights to '+ level +'\n';
    }

    for(var ip in targets) {
      if(targets[ip] in this.list){
        this.list[targets[ip]].setBrightness(level);
      }
    }
    return 'setting brightness of ' + targets.length + ' lights to '+ level +'\n';
  }

  setWarmWhite(targets) {
    if(!targets) return 'No targets specified.';
    if(targets === 'all') {
      var i = 0;
      for(var key in this.list) {
        this.list[key].setWarmWhite();
        i++;
      }
      return 'setting ' + i + ' lights to warm white\n';
    }

    for(var ip in targets) {
      if(targets[ip] in this.list){
        this.list[targets[ip]].setWarmWhite();
      }
    }
    return 'setting ' + targets.length + ' lights to warm white\n';
  }

  setColor(targets, colorValue) {
    if(!targets) return 'No targets specified.';
    if(!colorValue) return 'No color specified.';
    //TODO: CHECK FOR IMPROPER INPUTS
    if(typeof colorValue === 'string' &&  colors[colorValue]) {
      colorValue = colors[colorValue];
    }
    var rgb = this.hexToRGB(colorValue);

    if(targets === 'all') {
      var i = 0;
      for(var key in this.list) {
        this.list[key].setColor(rgb[0], rbg[1], rgb[2]);
        i++;
      }
      return 'setting color of ' + i + ' lights to '+ rgb +'\n';
    }

    for(var ip in targets) {
      if(targets[ip] in this.list){
        this.list[targets[ip]].setColor(rgb[0], rgb[1], rgb[2]);
      }
    }
    return 'setting color of ' + targets.length + ' lights to '+ rgb +'\n';
  }

  getDevices() {
    var devList = [];
    var i = 0;
    for(var key in this.list) {
      devList[i] = this.list[key].state();
      i++;
    }
    return devList;
  }

  addLight(addr, name) {
    if(!addr) return 'No light specified.';
    if(!name) name = addr;
    dns.lookup(addr, (err, ip, fam) => { // resolve any hostnames to IP
      this.list[name] = new WifiLedBulb(ip, name);
      config.addLight(ip, name);
    });
  }

  hexToRGB(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
  }
}
