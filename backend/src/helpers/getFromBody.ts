import User from '../api/user/model';
import { Request, Response, NextFunction } from '../interfaces';
import { response } from '../utils';
import { isEmpty } from 'lodash';

export default function(req: Request, res: Response, next: NextFunction): void {
  const {email} = req.body;
  
  if (isEmpty(email)) {
    response(res, 400);
  } else {
    User.findOne({ email }, (err, result) => {
      if (err) return response(res, 500, null, err);
      if (!result) return response(res, 404, null, { message: `User with email: \n'${email}' does not exists.`});

      next(result);
    });
  }
}