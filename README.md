# Flux Wifi LED Hub
A RESTful server application to offload requests to Flux Wifi LED bulbs.

## Installation
To install, simply clone the directory, install node modules, and execute the initial 'run' script to generate your API key:

    $ git clone https://github.com/gonnelladev/flux-led-hub.git
    $ cd flux-led-hub
    $ npm install
    $ npm run


### Dependencies
- [Node.js](https://nodejs.org)

## Configuration
The config file can be found in the root directory as the config.json file and
currently has only 4 options.
- listen: The ip address your server will listen on. By default it is open on all addresses.
- port: The port your server will listen on. Default is port 8000
- lights: a list of IP addresses corresponding to all of the Flux LEDs you wish to control.
- apikey: API key used to make requests. This will be set automatically on the first run or can be set/reset manually.

Once you have finished with your configuration, you can start the server with `npm start` and find the controls at http://localhost:8000 by default.

## API
To control lights from other devices you must `POST` requests to `http://<your.server.ip>/api/{on,off,toggle}` and include the api key in the POST data as "access_token".

For example a quick test to toggle the lights can be accomplished with `curl --data "access_token=<yourAPIkey>" http://<your.server.ip>:8000/api/toggle`

## Testing
Tests are currently all included within the server.js file.
To run a test simply run `npm test -- <options>` with a space deliniated list of tests as the options. Tests listed will be completed with a 3 second delay between each of them.

For example: `npm test -- on off` will connect with all of the lights listed in the config file, turn them on, wait 3 seconds, then turn them off.

Testing does not require an API key be set and will not set one unless the apikey test is run.

#### Test Options
- on: turn all lights on
- off: turn all lights off
- toggle: toggle all lights
- apikey: generate new API Key in config.json file. CAUTION: this will overwrite your existing key.

These options can also be found with the `npm test -- help` command.
