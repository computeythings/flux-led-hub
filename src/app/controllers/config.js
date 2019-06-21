"use strict"
const fs = require('fs');

const Keygen = require('../util/keygen.js');

exports.validate = apikey => {
  return apikey === config.apikey;
}

// This will only be run when the APIKEY line in config.json is empty
function resetAPIKey() {
  var apikey = Keygen(26); // 26 character API key
  console.info('generated new API key: ' + apikey);
  config.apikey = apikey;
  return writeJsonToConfig(config);
}
exports.resetAPIKey = resetAPIKey;

// Create usable WifiLedBulb objects from each light given in config
exports.getLights = () => {
  return config.lights;
}

exports.addLight = (addr, name) => {
  console.log(addr, name)
  config.lights[name] = addr;
  console.log(config);
  writeJsonToConfig(config)
}

//
// Read and populate config file
//
const CONFIG_FILE = process.env.CONFIG || '/config/config.json';
// for default config creation
const CONFIG_TEMPLATE = {
    lights: {
    },
    apikey: ""
};
// create empty config file
if(!fs.existsSync(CONFIG_FILE)) {
  if (!writeJsonToConfig(CONFIG_TEMPLATE)) {
      console.error('Failed to create config file.');
      console.error('Check data volume permissions.');
      process.exit(1);
  } else {
    console.info('Generated new config file at', CONFIG_FILE);
  }
}
const config = require(CONFIG_FILE);
// populate empty config file
if(!config.apikey) {
  resetAPIKey();
}

function writeJsonToConfig(json) {
  let jsonString = JSON.stringify(json, null, 4);
  fs.writeFileSync(CONFIG_FILE, jsonString, "utf8", function(err) {
    if(err) {
      console.error('Failed to update config file.');
      return false;
    }
  });
  console.info('Config file updated.');
  return true;
}
