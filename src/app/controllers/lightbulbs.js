"use strict"
const dns = require('dns');

const config = require('./config.js');
const colors = require('../util/colorkeys.js');
const WifiLedBulb = require('../model/lightbulb.js');

const list = {}
function init() {
  let lights = config.getLights();
  for (let name in lights) {
    let deviceIP = lights[name];
    dns.lookup(deviceIP, (err, addr, fam) => { // resolve any hostnames to IP
      list[name] = new WifiLedBulb(addr, name);
    });
  }
}
init();

exports.lightsOn = function(targets) {
  if(!targets) return 'No targets specified.';
  if(targets === 'all') {
    var i = 0;
    for(var key in list) {
      list[key].turnOn();
      i++;
    }
    return 'turning on ' + i + ' lights\n';
  }

  for(var ip in targets) {
    if(targets[ip] in list)
      list[targets[ip]].turnOn();
  }
  return 'turning on ' + targets.length + ' lights\n';
},

exports.lightsOff = function(targets) {
  if(!targets) return 'No targets specified.';
  if(targets === 'all') {
    var i = 0;
    for(var key in list) {
      list[key].turnOff();
      i++;
    }
    return 'turning off ' + i + ' lights\n';
  }


  for(var ip in targets) {
    if(targets[ip] in list)
      list[targets[ip]].turnOff();
  }
  return 'turning off ' + targets.length + ' lights\n';
},

/*
  Turns on all lights if a single bulb is on
  or turns all lights off if every bulb is on
*/
exports.toggleLights = function(targets) {
  if(!targets) return 'No targets specified.';
  if(targets === 'all') {
    return this.toggleLights(Object.keys(list));
  }
  var allOn = true;
  for(var ip in targets) {
    if(!list[targets[ip]].isOn()) {
      allOn = false;
    }
  }
  // Always find an excuse to use the ternary operator
  return allOn ? this.lightsOff(targets):this.lightsOn(targets);
},

exports.setBrightness = function(targets, level) {
  if(!targets) return 'No targets specified.';
  if(!level) return 'No brightness specified.';
  if(targets === 'all') {
    var i = 0;
    for(var key in list) {
      list[key].setBrightness(level);
      i++;
    }
    return 'setting brightness of ' + i + ' lights to '+ level +'\n';
  }

  for(var ip in targets) {
    if(targets[ip] in list){
      list[targets[ip]].setBrightness(level);
    }
  }
  return 'setting brightness of ' + targets.length + ' lights to '+ level +'\n';
},

exports.setWarmWhite = function(targets) {
  if(!targets) return 'No targets specified.';
  if(targets === 'all') {
    var i = 0;
    for(var key in list) {
      list[key].setWarmWhite();
      i++;
    }
    return 'setting ' + i + ' lights to warm white\n';
  }

  for(var ip in targets) {
    if(targets[ip] in list){
      list[targets[ip]].setWarmWhite();
    }
  }
  return 'setting ' + targets.length + ' lights to warm white\n';
},

exports.setColor = function(targets, colorValue) {
  if(!targets) return 'No targets specified.';
  if(!colorValue) return 'No color specified.';
  //TODO: CHECK FOR IMPROPER INPUTS
  if(typeof colorValue === 'string' &&  colors[colorValue]) {
    colorValue = colors[colorValue];
  }
  var rgb = hexToRGB(colorValue);

  if(targets === 'all') {
    var i = 0;
    for(var key in list) {
      list[key].setColor(rgb[0], rbg[1], rgb[2]);
      i++;
    }
    return 'setting color of ' + i + ' lights to '+ rgb +'\n';
  }

  for(var ip in targets) {
    if(targets[ip] in list){
      list[targets[ip]].setColor(rgb[0], rgb[1], rgb[2]);
    }
  }
  return 'setting color of ' + targets.length + ' lights to '+ rgb +'\n';
},

exports.getDevices = function() {
  var devList = [];
  var i = 0;
  for(var key in list) {
    devList[i] = list[key].state();
    i++;
  }
  return devList;
}

exports.addLight = function(addr, name) {
  if(!addr) return 'No light specified.';
  if(!name) name = addr;
  list[name] = new WifiLedBulb(addr, name);
  config.addLight(addr, name);
}

function hexToRGB(hex) {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b];
}
