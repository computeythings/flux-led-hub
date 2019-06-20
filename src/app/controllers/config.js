"use strict"
const fs = require('fs');
const dns = require('dns');

const Keygen = require('../util/keygen.js');
const WifiLedBulb = require('../model/lightbulb.js');

exports.validate = apikey => {
  return apikey === config.apikey;
}

// This will only be run when the APIKEY line in config.json is empty
exports.resetAPIKey = () => {
  var apikey = Keygen(26); // 26 character API key
  console.info('generated new API key: ' + apikey);
  config.apikey = apikey;
  return writeJsonToConfig(config);
}

// Create usable WifiLedBulb objects from each light given in config
exports.getLights = () => {
  var lightBulbs = {};
  for (let name in config.lights) {
    let deviceIP = config.lights[name];
    dns.lookup(deviceIP, (err, addr, fam) => { // resolve any hostnames to IP
      lightBulbs[name] = new WifiLedBulb(addr, name);
    });
  }
  return lightBulbs;
}

exports.addLight = (addr, name) => {
  config.lights[name] = addr;
  writeJsonToConfig(config)
}


const CONFIG_FILE = process.env.CONFIG + '/config.json' || '/config/config.json';
// for default config creation
const CONFIG_TEMPLATE = {
    lights: {
    },
    apikey: ""
};
if(!fs.existsSync(CONFIG_FILE)) {
  if (!writeJsonToConfig(tmpConfig)) {
      console.error('Failed to create config file.');
      console.error('Check data volume permissions.');
      process.exit(1);
  }
}
const config = require(CONFIG_FILE);
if(!config.apikey) {
  var apikey = Keygen(26); // 26 character API key
  console.info('generated new API key: ' + apikey);
  config.apikey = apikey;
  return writeJsonToConfig(config);
}


function writeJsonToConfig(json) {
  let jsonString = JSON.stringify(json, null, 4);
  fs.writeFileSync(CONFIG_FILE, jsonString, "utf8", function(err) {
    if(err) return false;
  });
  return true;
}
