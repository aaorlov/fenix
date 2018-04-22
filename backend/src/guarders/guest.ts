import { response } from '../utils';
import { Response, Request, NextFunction } from '../interfaces';
import { parseToken } from '../helpers';
import Auth from '../api/auth/model';

export default function(req: Request, res: Response, next: NextFunction): void {
  let token = parseToken(req);

  if (token) {
    Auth.verifyApiToken(token, isValid => {
      if (!isValid) {
        next();
      } else {
        response(res, 403);
      }
    });
  } else {
    next();
  }
}