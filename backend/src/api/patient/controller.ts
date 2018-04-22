import { ApiController } from '../../base';
import Repository from '../repository/model';
import QuickTest from '../quick-test/model';
import ProgressHistory from '../progress-history/model';
import Invite from '../invite/model';
import Doctor from '../doctor/model';
import { Request, Response, NextFunction } from '../../interfaces';
import { response, unix, panic } from '../../utils';
import moment = require('moment');
import { BLOOD_TYPES } from './schema';
import { isEmpty, omit, merge } from 'lodash';
import { ResolveOptions } from 'dns';
import { QUICK_TESTS_DIR } from '../repository/schema';
import { NOTIFICATION_INVITE, NOTIFICATION_STATUS_INFO } from '../../firebase';
import { STATUS_CANCELLED } from '../invite/schema';

export default new class PatientsController extends ApiController {

  public model = this.use('model');

  protected childrenLimit: number = 2;
  protected immutableFields: string[] = ['clientId', 'bloodTypeIndex', 'parent', 'doctor', 'weight', 'height', 'lastQuickTest', 'updatedAt', 'createdAt'];

  public validate(payload, req: Request, res: Response, next: NextFunction): void {
    const {bloodTypeIndex} = req.body;
    const {owner} = payload;

    if (!moment(req.body.birthday).isValid()) {
      return response(res, 400, null, { message: 'Invalid date in field \'birthday\'.' });
    }

    if (!bloodTypeIndex) {
      return response(res, 400, null, { message: 'Field \'bloodTypeIndex\' is required.' });
    }

    if (bloodTypeIndex === 0 || isEmpty(BLOOD_TYPES[bloodTypeIndex])) {
      return response(res, 400, null, { message: 'Invalid field \'bloodTypeIndex\'.' });
    }

    this.model.schema.find({ parent: owner._id }, (err, patients) => {
      if (err) return panic(res, err);

      if (patients.length < this.childrenLimit) {
        next(payload);
      } else {
        response(res, 403, null, { message: 'You have reached the limit of children.' });
      }
    });
  }

  public insert(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;
    const {origin} = req.body;    
    const data = {
      ...req.body,
      parent: owner._id,
      bloodType: BLOOD_TYPES[req.body.bloodTypeIndex],
    };

    this.model.create(data, (err, patient) => {
      if (err) return panic(res, err);

      if (origin) {
        Repository.saveFileWithThumbnail(owner.user, '', origin, 50, (err, paths) => {
          if (err) return panic(res, err);
          
          patient.update({ avatarUrl: paths.url, avatarThumbnailUrl: paths.thumbnailUrl }, err => {
            if (err) return panic(res, err);

            response(res, 201, patient);
          });
        }, `baby_avatar_${patient._id}`);
      } else {
        response(res, 201, patient);
      }
    });
  }

  public detail(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner, role} = payload;
    let condition;

    switch (role) {
      case global.ROLE_DOCTOR: condition = { _id: req.params.id, doctors: { $in: [owner._id] } }; break;
      case global.ROLE_PARENT: condition = { _id: req.params.id, parent: owner._id }; break;
    }

    this.model.findOne(condition, (err, result) => {
      if (err) return panic(res, err);

      response(res, 200, result);
    });
  }
  
  public quickTestsPagination(data, req: Request, res: Response, next: NextFunction): void {
    const {patient} = data;
    const {page, pageSize} = req.params;
    const {query, code, error} = QuickTest.paginateSync(page, pageSize, { patient });

    if (code >= 400 || error) return response(res, code, error);

    query
      .sort({ updatedAt: -1 })
      .populate('patient')      
      .exec((err, quickTests) => {
        if (err) return panic(res, err);

        response(res, 200, quickTests);
      });
  }

  public lastQuickTest(data, req: Request, res: Response, next: NextFunction): void {
    const {patient} = data;

    QuickTest.schema
      .findOne({ patient })
      .sort({ updatedAt: -1 })
      .exec((err, lastQuickTest) => {
        if (err) return panic(res, err);

        response(res, 200, lastQuickTest);
      });
  }

  public createAvatarFile(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;
    const {origin} = req.body;    

    this.model.findOne({ _id: req.params.id, parent: owner._id }, (err, patient) => {
      if (err) return panic(res, err);

      if (patient) {
        if (origin) {
          Repository.saveFileWithThumbnail(owner.user, '', origin, 50, (err, paths) => {
            if (err) return panic(res, err);
            
            next({ patient, avatarUrl: paths.url, avatarThumbnailUrl: paths.thumbnailUrl });
          }, `baby_avatar_${patient._id}`);
        } else {
          next({ patient });
        }
      } else {
        response(res, 403);
      }
    });
  }

  public overPatch(payload, req: Request, res: Response, next: NextFunction): void {
    const {patient, paths} = payload;
    const object = { ...omit(req.body, this.immutableFields), updatedAt: unix() };
    const patientId = patient._id;

    if (!isEmpty(paths)) merge(object, { ...paths });

    patient.update(object, { runValidators: true }, err => {
      if (err) return panic(res, err);

      this.model.schema.findById(patientId).populate('user').exec((err, patient) => {
        if (err) return panic(res, err);
        
        response(res, 202, patient);
      });
    });
  }

  public remove(data, req: Request, res: Response, next: NextFunction): void {
    const {patient, payload} = data;
    const {owner} = payload;
    const patientId = patient._id;

    patient.remove(err => {
      if (err) panic(res, err);

      response(res, 202);
      
      QuickTest.schema.find({ patient: patientId }, (err, quickTests) => {
        if (quickTests && quickTests.length > 0) {
          quickTests.forEach(quickTest => {
            Repository.removeFile(quickTest.originUrl);
          });
  
          QuickTest.schema.remove({ patient: patientId }, () => {});
        }
      });
      Invite.schema.remove({ patient: patientId }, () => {});
      ProgressHistory.schema.remove({ patient: patientId }, () => {});
      Repository.removeFile(`${owner.user._id}/baby_avatar_${patientId}.jpg`);
    });
  }

  public addDoctor(data, req: Request, res: Response, next: NextFunction): void {
    const {invite, payload} = data;
    const {owner} = payload;

    this.model.schema
      .findByIdAndUpdate(
        invite.patient._id,
        { $addToSet: { doctors: owner._id } },
        { new: true },
      (err, patient) => {
        if (err) return panic(res, err, 400);

        if (patient) {
          next(data)
        } else {
          response(res, 404, null, { message: `Can't add doctor to patient doctors list, where parent id: ${invite.patient._id}` });
        }
      });
  }

  public removeDoctor(data, req: Request, res: Response, next: NextFunction): void {
    const {invite, payload} = data;
    const {owner} = payload;
    const {doctor} = invite;

    this.model.schema
      .findOneAndUpdate(
        { doctors: { $in: [doctor] } },
        { $pullAll: { doctors: [doctor] }, updatedAt: unix() },
        { new: true },
      err => {
        if (err) return panic(res, err);

        Doctor.schema.findById(doctor).populate('user').exec((err, doctor) => {
          if (err) return panic(res, err);

          invite.status = STATUS_CANCELLED;
          response(res, 200, invite);
          next({
            user: doctor.user,
            title: 'Attention',
            message: `Parent ${invite.parent.firstName} ${invite.parent.lastName} stopped cooperation with you.`,
            payload: {
              _id: invite._id,
              patientId: invite.patient._id.toString(),
              status: NOTIFICATION_STATUS_INFO,
              type: NOTIFICATION_INVITE
            }
          });
        });
      });
  }

}
