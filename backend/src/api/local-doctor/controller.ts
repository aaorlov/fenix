import { ApiController } from '../../base';
import { Request, Response, NextFunction } from '../../interfaces';
import { response, panic, unix, noPermissions } from '../../utils';
import { omit, get, uniqueId } from 'lodash';
import Repository from '../repository/model';

export default new class LocalDoctorController extends ApiController {

  public model = this.use('model');

  public get immutableFields(): string[] {
    return ['patient', 'doctor', 'createdAt', 'updatedAt'];
  }

  public fetch(payload, req: Request, res: Response, next: NextFunction): void {
    this.model.schema.find({ parent: get(payload, 'owner._id') }, (err, localDoctors) => {
      if (err) return panic(res, err);

      response(res, 200, localDoctors);
    });
  }
  
  public details(payload, req: Request, res: Response, next: NextFunction): void {
    this.model.schema.findOne({ _id: req.params.id, parent: get(payload, 'owner._id') }, (err, localDoctor) => {
      if (err) return panic(res, err);

      if (localDoctor) {
        response(res, 200, localDoctor);
      } else {
        response(res, 403, null, noPermissions(this.model, req.params.id));
      }
    });
  }

  public produce(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;

    this.model.create({ parent: owner._id, ...omit(req.body, this.immutableFields) }, (err, localDoctor) => {
      if (err) return panic(res, err, 400);
      
      next({
        code: 201,
        instance: localDoctor,
        user: owner.user,
        field: 'avatarUrl',
        dir: 'local-doctors',
        filename: 'doctor_avatar_' + localDoctor._id
      });
    });
  }

  public overPatch(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;
    
    this.model.schema.findOneAndUpdate(
      { _id: req.params.id, parent: owner._id }, 
      { ...omit(req.body, this.immutableFields), updatedAt: unix() },
      { new: true }
    , (err, localDoctor) => {
      if (err) return panic(res, err, 400);

      next({
        code: 202,
        instance: localDoctor,
        user: owner.user,
        field: 'avatarUrl',
        dir: 'local-doctors',
        filename: 'doctor_avatar_' + localDoctor._id
      });
    });
  }

  public remove(payload, req: Request, res: Response, next: NextFunction): void {
    this.model.schema.findOneAndRemove({ _id: req.params.id, parent: payload.owner._id }, (err, localDoctor) => {
      if (err) return panic(res, err);
      
      if (localDoctor) {
        Repository.removeFile(localDoctor.avatarUrl)
        response(res, 202);
      } else {
        response(res, 403, null, noPermissions(this.model, req.params.id))
      }
    });
  }

  public sendResult(data, req: Request, res: Response, next: NextFunction): void {
    response(res, data.code || 200, data.instance);
  }

}
