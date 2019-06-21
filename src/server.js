"use strict"
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const dns = require('dns');

function startServer() {
  const app = express();
  require('./app/middleware/auth.js');
  app.use(bodyParser.urlencoded({
      extended: true
  }));
  app.use(bodyParser.json());
  app.use(express.static(path.resolve(__dirname, 'public')));
  app.disable('x-powered-by'); // security restritcion
  app.use(passport.initialize());
  app.use(require('./app/routes/api.js'));

  var port = process.env.PORT || 8000;
  var listenIP = process.env.BINDADDR || '0.0.0.0';

  require('http').createServer(app).listen(port, listenIP, () => {
      console.log('Listening on', listenIP + ":" + port);
  });
}

startServer();
