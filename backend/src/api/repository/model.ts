import { Model } from '../../base';
import Schema from './schema';
import { projectDir, config } from '../../utils';
import { uniqueId } from 'lodash';
import User from '../user/interface';

const fs = require('fs');
const moment = require('moment');
const sharp = require('sharp');
const basePath = `${projectDir}/${config('app').REPOSITORY.DIR}`;

class Repository extends Model {

  public saveFile(user: User, dir: string, base64: string, callback = (err: any, path: string = null) => {}, filename?: string): void {
    const stringArray = base64.split(',');
    const searchString = stringArray[0];
    let extenstion;
  
    if (searchString.indexOf('png') > -1) extenstion = 'png';
    if (searchString.indexOf('jpg') > -1) extenstion = 'jpg';
    if (searchString.indexOf('jpeg') > -1) extenstion = 'jpg';
    if (!extenstion) return callback({ code: 400, message: 'Invalid base64' });
  
    const id = user._id;
    const bitmap = new Buffer(stringArray[1], 'base64');
    const timestamp = moment(new Date()).format('YYYY-MM-DD_hh-mm-ss');
    filename = filename ? `${filename}.${extenstion}` : `${timestamp}_${uniqueId()}.${extenstion}`;
    const userDir = `${basePath}/${id}`;
    const publicPath = dir ? `${id}/${dir}/${filename}` : `${id}/${filename}`; 
    const resourceDir = dir ? `${basePath}/${id}/${dir}` : `${basePath}/${id}`;
    const path = `${resourceDir}/${filename}`;  
    
    try {
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir);
      }
    } catch (exception) {
      callback(exception);
    }

    try {
      if (!fs.existsSync(resourceDir)) {
        fs.mkdirSync(resourceDir);
      }
    } catch (exception) {
      callback(exception);
    }
  
    try {
      fs.writeFileSync(path, bitmap);
    } catch (exception) {
      callback(exception);
    }
  
    if (fs.existsSync(path)) {
      callback(null, publicPath);
    }
  }

  public saveFileWithThumbnail(user: User, dir: string, base64: string, size, callback = (err: any, path?: any) => {}, filename?: string): void {
    const stringArray = base64.split(',');
    const searchString = stringArray[0];
    let extenstion;
  
    if (searchString.indexOf('png') > -1) extenstion = 'png';
    if (searchString.indexOf('jpg') > -1) extenstion = 'jpg';
    if (searchString.indexOf('jpeg') > -1) extenstion = 'jpg';
    if (!extenstion) return callback({ code: 400, message: 'Invalid base64' });
  
    const id = user._id;
    const bitmap = new Buffer(stringArray[1], 'base64');
    const timestamp = moment(new Date()).format('YYYY-MM-DD_hh-mm-ss');
    filename = filename ? `${filename}` : `${timestamp}_${uniqueId()}`;
    const thumbnailFilename = `${filename}_thumbnail.${extenstion}`;
    filename = `${filename}.${extenstion}`;
    const userDir = `${basePath}/${id}`;
    const publicThumbnailPath = dir ? `${id}/${dir}/${thumbnailFilename}` : `${id}/${thumbnailFilename}`;
    const publicPath = dir ? `${id}/${dir}/${filename}` : `${id}/${filename}`; 
    const resourceDir = dir ? `${basePath}/${id}/${dir}` : `${basePath}/${id}`;
    const path = `${resourceDir}/${filename}`;
    const thumbnailPath = `${resourceDir}/${thumbnailFilename}`;
    
    try {
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir);
      }
    } catch (exception) {
      callback(exception);
    }

    try {
      if (!fs.existsSync(resourceDir)) {
        fs.mkdirSync(resourceDir);
      }
    } catch (exception) {
      callback(exception);
    }
  
    try {
      fs.writeFileSync(path, bitmap);
    } catch (exception) {
      callback(exception);
    }
    
    sharp(path)
      .resize(size, size)
      .toBuffer()
      .then(buffer => {
        try {
          fs.writeFileSync(thumbnailPath, buffer);
        } catch (exception) {
          callback(exception);
        }
      });
  
    if (fs.existsSync(path)) {
      callback(null, { url: publicPath, thumbnailUrl: publicThumbnailPath });
    }
  }

  public createDir(user, callback = (err: any) => {}): void {
    const userDir = `${basePath}/${user._id}`;

    try {
      fs.mkdir(userDir, callback);
    } catch (exception) {
      callback(exception);
    }
  }
  
  public removeFile(path, callback = (err?: any) => {}): void {
    path = `${basePath}/${path}`;

    try {
      fs.unlink(path, callback);
    } catch (exception) {
      callback(exception);
    }
  }

}

export default new Repository('Repository', Schema, 'repository');
