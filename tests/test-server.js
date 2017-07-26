const controller = require('../app/controller');
const config = require('../config/config.json');

module.exports.getLights = function() {
  var lights = config.lights;
  var devices = {};
  for (var key in lights) {
    devices[lights[key]] = new controller.WifiLedBulb(lights[key],
      nullFunction);
  }
  return devices
}

// For testing we don't need anything to run when bulbs change state
function nullFunction(){}
