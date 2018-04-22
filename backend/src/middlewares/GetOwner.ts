import { response } from '../utils';
import { Response, Request, NextFunction } from '../interfaces';
import { parseToken } from '../helpers';
import Auth from '../api/auth/model';
import Parent from '../api/parent/model';
import Doctor from '../api/doctor/model';

export default function(req: Request, res: Response, next: NextFunction): void {
  const decoded = Auth.decodeToken(parseToken(req));

  let model;
  let role;

  switch (decoded.role) {
    case global.ROLE_PARENT: model = Parent; role = global.ROLE_PARENT; break;
    case global.ROLE_DOCTOR: model = Doctor; role = global.ROLE_DOCTOR; break;

    default: return response(res, 403);
  }

  model.schema.findOne({ user: decoded.userId }).populate('user').exec((err, owner) => {
    if (err) return response(res, 500, null, err);

    if (owner) {
      if (this && !this.pass) {
        next();
      } else {
        next({ owner, role });
      }
    } else {
      response(res, 403);
    }
  });
}