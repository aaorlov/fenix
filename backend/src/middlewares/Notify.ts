import { Request, Response, NextFunction } from '../interfaces';
import { mailer } from '../utils';
import { notification } from '../firebase';
import { notificationHTML } from '../mailers';
import { get } from 'lodash';
import Auth from '../api/auth/model';

export default function(data, req: Request, res: Response, next: NextFunction): void {
  const {user, title, message, payload} = data;

  if (get(payload, '_id')) payload._id = payload._id.toString();
  
  if (user) {
    const {email} = user;
  
    Auth.schema.find({ user: user._id }, (err, auths) => {
      const devices = [];
  
      auths.forEach((auth, index) => {
        if (get(auth, 'deviceId')) {
          const {deviceId, token} = auth;
          const condition = (index === (auth.length - 1) && devices.length === 0);
          
          Auth.verifyApiToken(token, (isValid, err) => {
            if (err && err.name === 'TokenExpiredError') {
              return Auth.schema.remove({ token });
            }
    
            if (isValid && deviceId) {
              notification(deviceId, { title, body: message, ...payload }, (err, info) => {
                if (err && condition) {
                  return mailer(email, title, message, notificationHTML(message));
                } else if (err) return;
            
                devices.push(info);
              });
            } else if (condition) {
              mailer(email, title, message, notificationHTML(message));
            }
          });
        }
      });
    });
  }
}
