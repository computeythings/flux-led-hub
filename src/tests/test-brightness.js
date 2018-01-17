const server = require('./demo-server');

const DELAY = 500;
const LEVEL_SHIFT = 25; // test brightness in increments of 25%

var devices = server.getLights();
var failedTests = 0;

function setBrightness(level) {
  for(var key in devices) {
    var response = devices[key].setBrightness(level);
    assert(level,response);
  }
}

function assert(level, response) {
  if(level > 100)
    level = 100;
  if(level < 0)
    level = 0;

  if(level == response) {
    console.log('✔ Brightness set successfully');
  }
  else {
    console.log('✖ Error setting brightness');
    failedTests++;
  }
}

function testExpected(delay, brightness) {
  setTimeout(setBrightness, delay, brightness);
}

function testNegative(delay) {
  setTimeout(setBrightness, delay, -100);
}

function testOverflow(delay) {
  setTimeout(setBrightness, delay, 1000);
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
  var time = 0;
  var brightness = 0;
  while(brightness <= 100) {
    testExpected(time, brightness);
    time += DELAY;
    brightness += LEVEL_SHIFT;
  }
  testNegative(time);
  time += DELAY;
  testOverflow(time);
  time += DELAY;
  setTimeout(finish, time);
}

runTests();
