#!/usr/bin/env node

/**
 * Declare environment variables
 */

global.PRODUCTION_ENV = 'production';
global.DEVELOPMENT_ENV = 'development';
global.STAGING_ENV = 'staging';

/**
 * Declare role variables
 */

global.ROLE_GUEST = 'guest';
global.ROLE_PARENT = 'parent';
global.ROLE_DOCTOR = 'doctor';

/**
 * Module dependencies.
 */

import app from '../app';
import http = require('http');
import { log } from '../utils';
// import { applySockets } from '../helpers';

/**
 * Init config
 */

const config = require('../utils').config('app');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || config.PORT || '3000');

app.set('port', port);
app.set('env', process.env.NODE_ENV || global.DEVELOPMENT_ENV);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Plug in socket.io
 */

// applySockets(require('socket.io').listen(server), 'api');

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, config.DOMAIN);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      log.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      log.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe: ' + addr
    : 'port: ' + addr.port;

  log.info(`Listening on ${bind}. Environment: ${process.env.NODE_ENV}`);
}
