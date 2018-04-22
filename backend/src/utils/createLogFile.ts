import fs = require('fs');
import rfs = require('rotating-file-stream');
import projectDir from './projectDir';
const config = require('./config').default('logs');

export default function(filename: string, interval: string = config.CLEAR_EACH, logDirectory: string = config.DIRECTORY): fs.WriteStream {
  logDirectory = `${projectDir}/${logDirectory}`;
  
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }
  
  return rfs(`${filename}.log`, {
    interval: interval, // rotate daily
    path: logDirectory
  });
}