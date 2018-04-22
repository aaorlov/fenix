import createLogFile from './createLogFile';
import createBufferStream from './createBufferStream';
const moment = require('moment');
const config = require('./config').default('logs');
const env = process.env.NODE_ENV;

function core(type: string, message: string[]): void {
  if (env === global.PRODUCTION_ENV || env === global.STAGING_ENV) {
    let filename;
    
    switch (type) {
      case 'info': filename = 'info'; break;
      case 'error': filename = 'errors'; break;
      case 'warn': filename = 'warnings'; break;
      case 'notification': filename = 'firebase_notifications'; type = 'error'; break;
    }

    const stream = createBufferStream(createLogFile(filename, config.CLEAR_EACH), config.BUFFER_INTERVAL);
    const date: string = moment(new Date()).utc().format('DD/MMM/YYYY:hh:mm:ss ZZ');

    stream.write(`[${date}] ${message.join(' ')}\n`);
  } else {
    if (type === 'notification') type = 'error';
    console[type](message.join(' '));
  }
}

const error = (...message): void => core('error', message);
const info = (...message): void => core('info', message);
const warn = (...message): void => core('warn', message);
const notification = (...message): void => core('notification', message);

export default {
  error,
  info,
  warn,
  notification
};