import { STATUS_CODES } from 'http';
import { merge } from 'lodash';
import { Error, Response } from '../interfaces';
import moment = require('moment');
import log from './log';

export default function(res: Response, code: number, payload: any = null, err: Error = null): void {
  let response = { 
    status: STATUS_CODES[code], 
    code
  };

  if (err) {
    if (!code) {
      code = err.status || 500;
      response.status = STATUS_CODES[code];
      response.code = code;
    }

    const env = process.env.NODE_ENV;

    if (env === global.DEVELOPMENT_ENV || env === global.STAGING_ENV) {
      merge(response, { error: err.message || err });
      
      if (err.stack) {
        merge(response, { stack: err.stack.replace(/(?:\r\n|\r|\n)/g, '') });
      }
    }
    
    if (code < 500 && env == global.PRODUCTION_ENV) {
      merge(response, { error: err.message || err });
    }
    
    if (code === 500) {
      if (env === global.DEVELOPMENT_ENV) {
        console.error(err);
      }

      if (env === global.PRODUCTION_ENV || env === global.STAGING_ENV) {
        const error = err.stack || err;
      
        if (payload) {
          log.error(`Data: ${payload}\nError: ${error}`);
        } else {
          log.error(error);
        }
      }
    }
  } else if (payload) {
    response = payload;
  }

  res.status(code);  
  res.send(response);
}