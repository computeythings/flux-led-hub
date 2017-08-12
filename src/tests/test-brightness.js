const server = require('./test-server');

var devices = server.getLights();

function setBrightness(level) {
  console.log(`Setting brightness of all lights in config to ${level}%`);
  for(var key in devices) {
    devices[key].setBrightness(level);
  }
}

setTimeout(setBrightness, 2000, 0);
setTimeout(setBrightness, 4000, 25);
setTimeout(setBrightness, 6000, 50);
setTimeout(setBrightness, 8000, 100);
setTimeout(process.exit, 10000);
