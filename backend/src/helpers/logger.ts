import { createLogFile } from '../utils';
import logger = require('morgan');

export default function(): logger {
  if (process.env.NODE_ENV === global.PRODUCTION_ENV || process.env.NODE_ENV === global.STAGING_ENV) {
    return logger('combined', { stream: createLogFile('access') });    
  } else {
    return logger('dev');    
  }
}