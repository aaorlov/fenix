import { response } from '../utils';
import { Response, Request, NextFunction } from '../interfaces';
import { parseToken } from '../helpers';
import Auth from '../api/auth/model';

export default function(req: Request, res: Response, next: NextFunction): void {
  let token = parseToken(req);

  if (token) {
    Auth.verifyApiToken(token, (isValid, err) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return Auth.schema.remove({ token }, () => response(res, 403, null, err));
        } else {
          return response(res, 403, null, err);
        }
      }

      if (isValid) {
        res.set({ 'Authorization': `${Auth.headerPrefix}${token}` });        
        next();
      } else {
        response(res, 401);
      }
    });
  } else {
    response(res, 401);
  }
}