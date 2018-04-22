import { Request, Response, NextFunction } from '../interfaces';
import { response, noPermissions } from '../utils';
import Patient from '../api/patient/model';
import { omit } from 'lodash';

export default function(payload, req: Request, res: Response, next: NextFunction): void {
  const patientId = req.params.patientId || req.body.patientId || req.params.id;
  const {owner, role} = payload;

  let query;

  switch (role) {
    case global.ROLE_DOCTOR: 
      query = Patient.schema.findOne({ _id: patientId, doctors: { $in: [owner._id] }});;
      break;
    case global.ROLE_PARENT:
      query = Patient.schema.findOne({ _id: patientId, parent: owner._id });
      break;
  }

  if (this) {
    if (this.withParent) query.populate('parent');
    if (this.withDoctor) query.populate('doctors');
    if (this.parentWithUser) {
      query.populate({
        path: 'parent',
        populate: {
          path: 'user'
        }
      });
    }
    if (this.doctorWithUser) {
      query.populate({
        path: 'doctors',
        populate: {
          path: 'user'
        }
      });
    }
  }

  query.exec((err, patient) => {
    if (err) return response(res, 500, null, err);

    if (patient) {
      next({ patient, payload });
    } else {
      response(res, 403, null, noPermissions(Patient, patientId));
    }
  });
}