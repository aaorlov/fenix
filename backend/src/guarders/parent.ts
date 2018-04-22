import { response } from '../utils';
import { Response, Request, NextFunction } from '../interfaces';
import { parseToken } from '../helpers';
import authorized from './authorized';
import Auth from '../api/auth/model';

export default function(req: Request, res: Response, next: NextFunction): void {
  let token = parseToken(req);
  
  if (token) {
    Auth.verifyToken(token, (err, decoded) => {
      if (err) return response(res, 403);

      if (decoded.role === global.ROLE_PARENT) {
        authorized(req, res, next);
      } else {
        response(res, 403);
      }
    });
  } else {
    response(res, 401);
  }
}