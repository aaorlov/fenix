import ApiController from './ApiController';
import { Request, Response, NextFunction } from '../interfaces';
import { response, noPermissions } from '../utils';
import { get, isEmpty } from 'lodash';

export default class OwnerController extends ApiController {

  protected ownPath: string = '_id';
  
  public own(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;
    const id: string = get(owner, this.ownPath);

    this.model.schema.findById(id).populate('user').exec((err, result) => {
      if (err) return response(res, 500, null, err);

      if (result) {
        response(res, 200, result);
      } else {
        response(res, 403, null, noPermissions(this.model, id));
      }
    });
  }

  public fetch(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner, role} = payload;
    const id: string = get(owner, this.ownPath);

    this.model.schema.find({ [role]: id }, (err, result) => {
      if (err) return response(res, 500, null, err);

      if (result) {
        response(res, 200, result);
      } else {
        response(res, 403, null, noPermissions(this.model, id));
      }
    });
  }

  public detail(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner, role} = payload;
    const id: string = get(owner, this.ownPath);
    
    this.model.schema.findOne({ _id: req.params.id, [role]: id }, (err, result) => {
      if (err) return response(res, 500, null, err);

      if (result) {
        response(res, 200, result);
      } else {
        response(res, 403, null, noPermissions(this.model, id));
      }
    });
  }

  public paginateForOwner(payload, req: Request, res: Response, next?: NextFunction): void {
    const {owner, role} = payload;
    
    if (!req.params.count || isEmpty(req.params.count)) {
      return response(res, 404);
    }

    if (!Number(req.params.count)) {
      return response(res, 400, null, { message: 'Parameter \'count\' should be a number' });
    }

    this.model.schema.find({ [role]: get(owner, this.ownPath) }, (err, result) => {
      if (err) return response(res, 500, null, err);

      response(res, 200, result);
    }).limit(Number(req.params.count));
  }

}