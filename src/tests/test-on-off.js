const server = require('./test-server');

var devices = server.getLights();

function allOn() {
  console.log('Turning all lights in config file on');
  for(var key in devices) {
    devices[key].turnOn();
  }
}

function allOff() {
  console.log('Turning all lights in config file off');
  for(var key in devices) {
    devices[key].turnOff();
  }
}

allOn();
setTimeout(allOff, 2000);
setTimeout(allOn, 4000);
setTimeout(allOff, 6000);
setTimeout(process.exit, 8000);
