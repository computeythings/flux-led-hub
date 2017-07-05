var controller = require('../app/controller');

var b1 = require('net').Socket();
var b2 = require('net').Socket();
var b3 = require('net').Socket();

b1.connect(5577, 'bulb1');
b2.connect(5577, 'bulb2');
b3.connect(5577, 'bulb3');

console.log('Turning off lights...');

controller.turnOff(b1);
controller.turnOff(b2);
controller.turnOff(b3);

setTimeout(function() {
  console.log('Turning on lights...');

  controller.turnOn(b1);
  controller.turnOn(b2);
  controller.turnOn(b3);
}, 5000);

setTimeout(function() {
  console.log('Finished tests - closing sockets.');

  b1.end();
  b2.end();
  b3.end();
}, 7000);
