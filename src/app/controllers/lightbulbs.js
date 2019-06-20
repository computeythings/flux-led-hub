"use strict"
const colors = require('../util/colorkeys.js');
const config = require('./config.js');

const list = config.getLights();

exports.lightsOn = function(targets) {
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
},

exports.lightsOff = function(targets) {
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
},

/*
  Turns on all lights if a single bulb is on
  or turns all lights off if every bulb is on
*/
exports.toggleLights = function(targets) {
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
},

exports.setBrightness = function(targets, level) {
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
},

exports.setWarmWhite = function(targets) {
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
},

exports.setColor = function(targets, colorValue) {
  //TODO: CHECK FOR IMPROPER INPUTS
  if(typeof colorValue === 'string' &&  colors[colorValue]) {
    colorValue = colors[colorValue];
  }
  var rgb = hexToRGB(colorValue);

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
},

exports.getDevices = function() {
  var devList = [];
  var i = 0;
  for(var key in this.list) {
    devList[i] = this.list[key].state();
    i++;
  }
  return devList;
}

function hexToRGB(hex) {
  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return [r, g, b];
}
