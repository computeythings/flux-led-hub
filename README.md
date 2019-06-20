# Flux Wifi LED Hub
A RESTful server application to offload requests to Flux Wifi LED bulbs.

## Installation
To install, simply clone the directory, install node modules, and execute the initial 'run' script to generate your API key:

    $ git clone https://github.com/computeythings/flux-led-hub.git
    $ cd flux-led-hub
    $ npm install
    $ npm start

Or install with docker:

    $ docker run --name flux-led-hub -d -p 8000:8000 -v /path/to/host:/config computeythings/flux-led-hub


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
