import { Model } from '../../base';
import { get } from 'lodash';
import { projectDir } from '../../utils';
import AuthInterface from './interface';
import fs = require('fs');
import path = require('path');
import Schema from './schema';
import jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const config = require('../../utils').config('security');

class Auth extends Model {

  private get privateKey(): Buffer {
    return fs.readFileSync(path.join(projectDir, config.SSL.CSR_DIR, config.SSL.PRIVATE_KEY_FILE_NAME));
  }

  private get publicKey(): Buffer {
    return fs.readFileSync(path.join(projectDir, config.SSL.CSR_DIR, config.SSL.PUBLIC_KEY_FILE_NAME));
  }

  public get headerPrefix(): string {
    return 'Bearer ';
  }

  public registerApiToken(data, callback = (err: any, result: any) => {}): void {
    this.findOne({ user: data.user._id, deviceId: data.deviceId }, (err, result) => {
      if (err) return callback(err, null);

      const role = this.defineRole(data);
      
      if (role !== global.ROLE_GUEST) {
        const userId = get(data, 'user._id');
        const token = this.generateToken({ userId, role });
  
        data = { token, user: userId, deviceId: data.deviceId };
  
        if (result) {
          this.update(result._id, data, callback);
        } else {
          this.create(data, callback);
        }
      } else {
        callback('Cannot define role by requested data.', null);
      }
    });
  }

  public generateToken(data: any): void {
    return jwt.sign(
      data, 
      { 
        key: this.privateKey, 
        passphrase: config.TOKEN.PASSPHRASE 
      },
      { 
        expiresIn: config.TOKEN.EXPIRES_IN, 
        algorithm: config.TOKEN.ALGORITHM
      }
    );
  }

  public removeTokenFromWhiteList(token: string, callback = (err: any, status: number) => {}): void {
    if (token) {
      this.schema.remove({ token }, err => {
        if (err) return callback(err, 500);

        callback(null, 200);
      });
    } else {
      callback('Invalid token', 422);
    }
  }

  public verifyApiToken(token: string, callback = (isValid: boolean, err = null) => {}): void {
    if (token) {
      this.verifyToken(token, err => {
        if (err) return callback(false, err);

        this.findOne({ token }, (err, result) => {
          if (err) return callback(false);
  
          callback(!!result);
        });
      });
    } else {
      callback(false);
    }
  }
  
  public verifyToken(token: string, callback = (err: any, decoded: string) => {}): void {
    jwt.verify(token, this.publicKey, callback);
  }

  public decodeToken(token: string): string {
    return jwt.verify(token, this.publicKey);
  }

  public comparePassword(plainPass: string, hashword: string, callback = (err: any, isPasswordMatch: boolean = false) => {}): void {
    bcrypt.compare(plainPass, hashword, (err, isPasswordMatch) => {  
      if (err) return callback(err, isPasswordMatch);

      callback(null, isPasswordMatch);
    });
  }
  
  private defineRole(data: AuthInterface): string {
    if (data.hasOwnProperty(global.ROLE_PARENT)) return global.ROLE_PARENT;    
    if (data.hasOwnProperty(global.ROLE_DOCTOR)) return global.ROLE_DOCTOR;

    return global.ROLE_GUEST;
  }

}

export default new Auth('WhiteListToken', Schema, 'whitelist');