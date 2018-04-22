import { Model } from '../../base';
import Schema from './schema';

const mongooseHidden = require('mongoose-hidden')();
const bcrypt = require('bcrypt');
const config = require('../../utils').config('security');

class User extends Model {

  public encryptPassword(password: string, callback = (err: any, hash: string = null) => {}): void {
    bcrypt.genSalt(config.PASSWORD_SALT_LENGTH, (err, salt) => {
      if (err) return callback(err);
  
      bcrypt.hash(password, salt, callback);
    });
  }

}

export default new User('User', Schema, null, mongooseHidden, { hidden: { _id: false } });