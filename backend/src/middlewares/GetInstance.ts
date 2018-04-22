import { Request, Response, NextFunction } from '../interfaces';
import { response, panic, noPermissions } from '../utils';
import { get, isEqual, findIndex } from 'lodash';

export default function (payload, req: Request, res: Response, next: NextFunction): void {
  const {owner, role} = payload;
  const model: any = get(this, 'model');
  const doctor: any = get(this, 'doctor');
  const parent: any = get(this, 'parent');
  const combined: any = get(this, 'combined');

  if (model) {
    model.schema
      .findById(req.params.id)
      .populate({
        path: 'patient',
        populate: {
          path: 'doctors'
        }
      })
      .exec((err, instance) => {
        if (err) return panic(res, err);

        function parent() {
          if (isEqual(get(instance, 'patient.parent'), owner._id)) {
            return next({ payload, instance });
          }

          response(res, 403, null, noPermissions(this.model, req.params.id));
        }

        function doctor() {
          if (findIndex(get(instance, 'patient.doctors'), { _id: owner._id }) > -1) {
            return next({ payload, instance });
          }

          response(res, 403, null, noPermissions(this.model, req.params.id));
        }
        
        if (doctor || parent || combined) {
          if (doctor) return doctor();          
          if (parent) return parent();
          if (combined) {
            switch (role) {
              case global.ROLE_DOCTOR: return doctor();
              case global.ROLE_PARENT: return parent();
              default: return response(res, 403, null, noPermissions(this.model, req.params.id));
            }
          }
        } else {
          throw new Error('GetInstance middleware: property doctor/parent/combined is required.');
        }
      });
  } else {
    throw new Error('GetInstance middleware: property \'model\' is required.');
  }
}