import { RoleController } from '../../base';
import Repository from '../repository/model';
import Patient from '../patient/model';
import Invite from '../invite/model';
import { Request, Response, NextFunction } from '../../interfaces';
import { response, unix, panic } from '../../utils';
import { omit, merge } from 'lodash';
import { STATUS_ACCEPTED, STATUS_SENT } from '../invite/schema';

export default new class ParentsController extends RoleController {

  public model = this.use('model');

  protected instanceName: string = 'parent';
  protected fields: string[] = ['firstName', 'lastName', 'phoneNumber'];
  protected immutableFields: string[] = ['user', 'doctors', 'updatedAt', 'createdAt'];
  
  public createAvatarFile(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;
    const {origin} = req.body;

    this.model.findOne({ user: owner.user }, (err, parent) => {
      if (err) return panic(res, err);

      if (parent) {
        if (origin) {
          Repository.saveFile(owner.user, '', origin, (err, path) => {
            if (err) return panic(res, err);
  
            next({ parent, path });
          }, 'avatar');
        } else {
          next({ parent });
        }
      } else {
        response(res, 403);
      }
    });
  }

  public overPatch(data, req: Request, res: Response, next: NextFunction): void {
    const {parent, path} = data;
    const object = { ...omit(req.body, this.immutableFields), updatedAt: unix() };
    const parentId = parent._id

    if (path) merge(object, { avatarUrl: path });

    parent.update(object, { runValidators: true }, err => {
      if (err) return panic(res, err, 400);

      this.model.schema.findById(parentId).populate('user').exec((err, parent) => {
        if (err) return panic(res, err);
        
        response(res, 202, parent);
      });
    });
  }

  public patients(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;

    Patient.schema.find({ parent: owner._id }, (err, patients) => {
      if (err) return panic(res, err);

      response(res, 200, patients);
    });
  }
  
  public doctors(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;

    Invite.schema.find({'doctor': { $in: owner.doctors }}).populate('doctor').exec((err, doctors) => {
      if (err) return panic(res, err);

      response(res, 200, doctors);
    });
  }
  
  public invitedDoctors(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;

    Invite.schema.find({'doctor': { $in: owner.doctors }, status: STATUS_SENT }).populate('doctor').exec((err, doctors) => {
      if (err) return panic(res, err);

      response(res, 200, doctors);
    });
  }

  public addDoctor(data, req: Request, res: Response, next: NextFunction): void {
    const {invite, payload} = data;
    const {owner} = payload;

    this.model.schema
      .findByIdAndUpdate(
        invite.patient.parent._id,
        { $addToSet: { doctors: owner._id } },
        { new: true },
      (err, patient) => {
        if (err) return panic(res, err, 400);

        if (patient) {
          next(data)
        } else {
          response(res, 404, null, { message: `Can't add doctor to parent doctors list, where parent id: ${invite.patient.parent._id}` });
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

        next({ invite, payload });
      });
  }

}
