import { RoleController } from '../../base';
import { Request, Response, NextFunction } from '../../interfaces';
import { response, unix, panic } from '../../utils';
import Invite from '../invite/model';
import QuickTest from '../quick-test/model';
import Repository from '../repository/model';
import Patient from '../patient/model';
import { STATUS_SENT, STATUS_ACCEPTED } from '../invite/schema';
import { omit, merge } from 'lodash';

export default new class DoctorsController extends RoleController {

  public model = this.use('model');

  protected instanceName: string = 'doctor';  
  protected fields: string[] = ['firstName', 'lastName', 'position', 'address', 'phoneNumber'];
  protected immutableFields: string[] = ['user', 'createdAt', 'updatedAt'];

  public patients(data, req: Request, res: Response, next: NextFunction): void {
    const {owner} = data;

    Invite.schema
      .find({ doctor: owner._id, status: STATUS_ACCEPTED })
      .populate({ 
        path: 'patient',
        populate: {
          path: 'parent',
          populate: {
            path: 'user'
          }
        } 
      })
      .exec((err, invites) => {
        if (err) return panic(res, err);

        response(res, 200, invites);
      });
  }
  
  public invites(data, req: Request, res: Response, next: NextFunction): void {
    const {owner} = data;

    Invite.schema
      .find({ doctor: owner._id, status: STATUS_SENT })
      .populate({ 
        path: 'patient',
        populate: {
          path: 'parent',
          populate: {
            path: 'user'
          }
        } 
      })
      .exec((err, invites) => {
        if (err) return panic(res, err);

        response(res, 200, invites);
      });
  }
  
  public lastInvite(data, req: Request, res: Response, next: NextFunction): void {
    const {owner} = data;

    Invite.schema
      .findOne({ doctor: owner._id, status: STATUS_SENT })
      .populate({ 
        path: 'patient',
        populate: {
          path: 'parent',
          populate: {
            path: 'user'
          }
        } 
      })
      .exec((err, invite) => {
        if (err) return panic(res, err);

        if (invite) {
          response(res, 200, invite);
        } else {
          response(res, 200, {});
        }
      });
  }
  
  public patientsCount(data, req: Request, res: Response, next: NextFunction): void {
    const {owner} = data;

    Invite.schema.find({ doctor: owner._id, status: STATUS_ACCEPTED }, (err, invites) => {
      if (err) return panic(res, err);

      response(res, 200, { count: invites.length });
    });
  }
  
  public invitesCount(data, req: Request, res: Response, next: NextFunction): void {
    const {owner} = data;

    Invite.schema.find({ doctor: owner._id, status: STATUS_SENT }, (err, invites) => {
      if (err) return panic(res, err);

      response(res, 200, { count: invites.length });
    });
  }
  
  public newQuickTestsCount(data, req: Request, res: Response, next: NextFunction): void {
    const {owner} = data;

    Patient.schema.find({ doctors: { $in: [owner._id] } }, (err, patients) => {
      if (err) return panic(res, err);

      QuickTest.schema.find({'patient': { $in: patients }, viewed: false}, (err, quickTests) => {
        if (err) return panic(res, err);
  
        response(res, 200, { count: quickTests.length });
      });
    });
  }

  public overPatch(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;
    const {origin} = req.body;

    this.model.findOne({ user: owner.user }, (err, doctor) => {
      if (err) return panic(res, err);

      if (doctor) {
        if (origin) {
          Repository.saveFile(owner.user, '', origin, (err, path) => {
            if (err) return panic(res, err);
  
            next({ doctor, path });
          }, 'avatar');
        } else {
          next({ doctor });
        }
      } else {
        response(res, 403);
      }
    });
  }

  public forceUpdate(data, req: Request, res: Response, next: NextFunction): void {
    const {doctor, path} = data;
    const object = { ...omit(req.body, this.immutableFields), updatedAt: unix() };
    const doctorId = doctor._id;

    if (path) merge(object, { avatarUrl: path });

    doctor.update(object, { runValidators: true }, err => {
      if (err) return panic(res, err);

      this.model.schema.findById(doctorId).populate('user').exec((err, doctor) => {
        if (err) return panic(res, err);

        response(res, 202, doctor);
      });
    });
  }

}