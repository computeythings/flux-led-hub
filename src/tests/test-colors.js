const server = require('./demo-server');

const DELAY = 500;

var devices = server.getLights();
var failedTests = 0;

function setColor(r,g,b) {
  console.log(`Setting colors to RGB[${r},${g},${b}]`);
  for(var key in devices) {
    var response = devices[key].setColor(r,g,b);
    //assert(level,response);
  }
}
/*
function assert(level, response) {
  if(level > 255)
    level = 255;
  if(level < 0)
    level = 0;

  if(level == response) {
    console.log('✔ Color set successfully');
  }
  else {
    console.log('✖ Error setting color');
    failedTests++;
  }
}

function testExpected(delay, color) {
  setTimeout(setcolor, delay, color);
}

function testNegative(delay) {
  setTimeout(setcolor, delay, -100);
}

function testOverflow(delay) {
  setTimeout(setcolor, delay, 1000);
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
  var color = 0;
  while(color <= 100) {
    testExpected(time, color);
    time += DELAY;
    color += LEVEL_SHIFT;
  }
  testNegative(time);
  time += DELAY;
  testOverflow(time);
  time += DELAY;
  setTimeout(finish, time);
}

runTests();
*/

setTimeout(setColor, 0000, 255,0,0);
setTimeout(setColor, 2000, 255,131,0);
setTimeout(setColor, 4000, 255,255,0);
setTimeout(setColor, 6000, 0,255,0);
setTimeout(setColor, 8000, 0,0,255);
setTimeout(setColor, 10000, 255,0,131);
setTimeout(setColor, 12000, 255,0,255);
setTimeout(setColor, 14000, 255,131,255);
setTimeout(setColor, 16000, 255,255,255);
setTimeout(process.exit, 18000);
