module.exports.list = {};

module.exports.lightsOn = function(targets) {
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

module.exports.lightsOff = function(targets) {
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
module.exports.toggleLights = function(targets) {
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

module.exports.setBrightness = function(targets, level) {
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
      console.log('setting brightness of ' + targets[ip]);
      this.list[targets[ip]].setBrightness(level);
    }
  }
  return 'setting brightness of ' + targets.length + ' lights to '+ level +'\n';
},

module.exports.getDevices = function() {
  var devList = [];
  var i = 0;
  for(var key in this.list) {
    devList[i] = this.list[key].state();
    i++;
  }
  return devList;
}
