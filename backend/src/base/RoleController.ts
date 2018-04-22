import OwnerController from './OwnerController';
import { Request, Response, NextFunction } from '../interfaces';
import { omit, isEmpty } from 'lodash';
import { response, unix, panic } from '../utils';
import { getFromBody, destroyUser } from '../helpers';

export default class RoleController extends OwnerController {

  protected instanceName: string = 'default';
  protected fields: string[] = [];

  public produce(user, req: Request, res: Response, next: NextFunction): void {
    const fields = {};
    const {email} = user;

    this.fields.forEach(field => {
      const prop = req.body[field];

      if (prop) fields[field] = prop;
    });
    
    if (isEmpty(fields)) {
      response(res, 400);
    } else {
      this.model.create(fields, (err, result) => {
        if (err) return panic(res, err, 400);
  
        user.save((err, user) => {
          if (err) {
            if (err.stack && err.stack.indexOf('E11000') > -1) {
              return this.badResponse(res, { message: `User with email: \n${email} already exists.` }, result);
            }

            return this.badResponse(res, err, result);
          }
  
          result.update({ user: user._id, updatedAt: unix() }, err => {
            if (err) return this.badResponse(res, err, result);

            next({
              role: this.instanceName,
              [this.instanceName]: result,
              user
            });
          });
        });
      });
    }
  }
  
  public populate(user, req: Request, res: Response, next: NextFunction): void {
    this.model.schema.findOne({ user: user._id }).populate('user').exec((err, result) => {
      if (err) return panic(res, err);

      if (result && result.user) {
        next({
          [this.instanceName]: omit(result.toObject(), 'user'),
          user: result.user
        });
      } else {
        destroyUser(user._id, (err, user) => {
          response(res, 422, null, { message: `User with id '${user._id}' has been deleted, because he had no role.` });
        });
      }
    });
  }
  
  protected badResponse(res: Response, err, result): void {
    result.remove(() => panic(res, err, 422));
  }

  public getFromBody(req: Request, res: Response, next: NextFunction): void {
    getFromBody(req, res, next);
  }

}