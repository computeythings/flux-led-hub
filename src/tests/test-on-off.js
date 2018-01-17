const server = require('./demo-server');

// adjust this if tests are failing due to delayed/premature checks
const NETWORK_DELAY = 500;

const ON_STATE = 35;
const OFF_STATE = 36;

var devices = server.getLights();
var failedTests = 0;

function allOn() {
  for(var key in devices) {
    devices[key].turnOn();
    setTimeout(assert, NETWORK_DELAY, devices[key], true);
  }
}

function allOff() {
  for(var key in devices) {
    devices[key].turnOff();
    setTimeout(assert, NETWORK_DELAY, devices[key], false);
  }
}

function assert(device, state) {
  if(device.isOn() == state) {
    console.log('✔ Set power state successfully');
  }
  else {
    console.log('✖ Error setting power state');
    failedTests++;
  }
}

function finish() {
    if(failedTests == 0) {
      console.log('All tests passed!');
      process.exit();
    }
    else {
      console.log(`Failed ${failedTests} tests`);
      process.exit(1);
    }
}

function runTests() {
  setTimeout(allOn, 0000);
  setTimeout(allOff, 1000);
  setTimeout(allOn, 2000);
  setTimeout(finish, 3000);
}

runTests();
