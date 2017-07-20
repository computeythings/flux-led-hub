function startTesting(tests) {
  const testHelp = 'Usage: node server.js test <options>\n' +
                      '\ton: turn all lights on\n' +
                      '\toff: turn all lights off\n' +
                      '\ttoggle: toggle all lights\n' +
                      '\tapikey: generate new API Key in config.json file. ' +
                      'CAUTION: this will overwrite your existing key.\n';
  if(tests.length == 0 || tests == 'help') {
    console.log(testHelp);
    return;
  }

  lights = config.lights;
  for (var key in lights) {
    devices[lights[key]] = new controller.WifiLedBulb(lights[key],
      clientUpdate);
  }

  console.log('Attempting to run tests');
  var i;
  for(i = 0; i < tests.length; i++) {
    setTimeout(runTest, 3000*(i+1), tests[i]);
  }
  setTimeout(function(){
    for(var key in devices)
      devices[key].socket.destroy();
  }, 3000*(++i));
  setTimeout(process.exit, 3000*(++i));
}
