import { ApiController } from '../../base';
import PatientInterface from '../patient/interface';
import AuthInterface from '../auth/interface';
import User from '../user/model';
import Doctor from '../doctor/model';
import Auth from '../auth/model';
import Patient from '../patient/model';
import LocalDoctor from '../local-doctor/model';
import { Request, Response, NextFunction } from '../../interfaces';
import { response, mailer, log, unix, noPermissions, panic } from '../../utils';
import { notification } from '../../firebase';
import { inviteDoctorHTML, inviteNewDoctorHTML } from '../../mailers';
import { get, merge, omit } from 'lodash';
import { 
  NOTIFICATION_INVITE,
  NOTIFICATION_STATUS_INFO,
  NOTIFICATION_STATUS_DETAILS,
} from '../../firebase';
import { 
  STATUS_FAILED, 
  STATUS_IN_PROGRESS,
  STATUS_SENT,
  STATUS_ACCEPTED,
  STATUS_REJECTED,
  STATUS_CANCELLED,
  STATUS_DRAFT
} from './schema';

export default new class InvitesController extends ApiController {

  public model = this.use('model');

  private successRequest(res: Response, inviteId: string, data: any, updateData: any = {}): void {
    this.model.update(inviteId, merge({ status: STATUS_SENT }, updateData), localErr => {
      if (localErr) return panic(res, localErr);

      response(res, 200, merge(data, { _id: inviteId }));
    });
  }

  private failureRequest(res: Response, inviteId: string, err: any, data: any = null, code: number = 500): void {
    this.model.update(inviteId, { status: STATUS_FAILED }, localErr => {
      if (localErr) return panic(res, localErr);

      response(res, code, data, err);
    });
  }
  
  private sendInviteEmail(res: Response, inviteId, patient, email, message): void {
    mailer(email, 'Invite from parent', message, inviteDoctorHTML(patient), (err, info) => {
      if (err) return this.failureRequest(res, inviteId, err);

      this.successRequest(res, inviteId, { message: `Doctor has been invited by email: ${email}.`, info });
    });
  }

  public validate(req: Request, res: Response, next: NextFunction): void {
    const {email, patientId} = req.body;

    if (email) {
      this.model.findOne({ receiver: email, patient: patientId }, (err, result) => {

        switch (get(result, 'status')) {
          case STATUS_ACCEPTED:
            response(res, 403, null, { message: `Doctor with email: '${email}' already in your doctors list.` });
            break;
          case STATUS_SENT:
            response(res, 403, null, { message: `Invite for email: '${email}' already sent.` });
            break;
          case STATUS_FAILED:
            this.model.destroy(result._id);
            next();
            break;
          default: return next();
        }
      });
    } else {
      response(res, 400, null, { message: 'field \'email\' is required.' });
    }
  }

  public registerInvite(data, req: Request, res: Response, next: NextFunction): void {
    const {patient, payload} = data;
    const {owner} = payload;
    const {email} = req.body;

    this.model.schema.findOne({ parent: owner._id, patient: patient._id, receiver: email }, (err, invite) => {
      if (err) return panic(res, err);
      
      if (get(invite, '_id')) {
        next({ patient: patient, inviteId: invite._id });
      } else {
        this.model.create({ parent: owner._id, patient: patient._id, receiver: email }, (err, invite) => {
          if (err) return panic(res, err);
    
          next({ patient, inviteId: invite._id });
        });
      }
    });
  }

  public prepareInvite(data, req: Request, res: Response, next: NextFunction): void {
    const {inviteId, patient} = data;
    const {email} = req.body;

    User.findOne({ email }, (err, user) => {
      if (err) return this.failureRequest(res, inviteId, err);

      if (user) {
        Doctor.findOne({ user: user._id }, (err, doctor) => {
          if (err) return this.failureRequest(res, inviteId, err);
          
          Auth.findOne({ user: user._id }, (err, auth) => {
            if (err) return this.failureRequest(res, inviteId, err);

            if (get(auth, 'deviceId')) {
              next({ user, inviteId, patient, doctor, deviceId: auth.deviceId });
            } else {
              next({ inviteId, patient, doctor });
            }
          });
        });
      } else {
        next({ inviteId, patient });
      }
    });
  }

  public invite(data, req: Request, res: Response, next: NextFunction): void {
    const {user, inviteId, patient, doctor, deviceId} = data;
    const {email} = req.body;
    const message = `You have new invite from ${patient.fullName}.`;

    this.model.update(inviteId, { status: STATUS_IN_PROGRESS });

    if (doctor) {
      if (deviceId && user) {
        this.model.update(inviteId, { doctor }, (err) => {
          if (err) return this.failureRequest(res, inviteId, err);

          this.successRequest(res, inviteId, { message: 'Doctor has been invited.' });
          next({
            user,
            title: 'New invite',
            message,
            payload: {
              _id: inviteId,
              type: NOTIFICATION_INVITE,
              status: NOTIFICATION_STATUS_DETAILS
            }
          });
        });
      } else {
        this.sendInviteEmail(res, inviteId, patient, email, message);
      }
    } else {
      mailer(email, 'Invite to BabyPassPro', message, inviteNewDoctorHTML(patient), (err, info) => {
        if (err) return this.failureRequest(res, inviteId, err);
  
        this.successRequest(res, inviteId, { message: `Doctor has been invited by email: ${email}.`, info });
      });
    }
  }

  public assign(data: AuthInterface, req: Request, res: Response, next: NextFunction): void {
    this.model.schema.find({ receiver: data.email }).exec((err, invites) => {
      if (err) return panic(res, err);

      if (get(data, 'doctor._id')) {
        invites.forEach(invite => {
          this.model.update(invite._id, { doctor: data.doctor._id });
        });
      }
        
      next(data);
    });
  }

  public accept(data, req: Request, res: Response, next: NextFunction): void {
    const {owner} = data;

    this.model.schema
      .findOne({ _id: req.params.id, doctor: owner._id })
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
          switch (get(invite, 'status')) {
            case STATUS_ACCEPTED: return response(res, 200, { message: 'Invite already accepted.' });
            case STATUS_CANCELLED: return response(res, 200, { message: 'Invite canceled by parent' });
          }

          next({ 
            invite, 
            payload: data, 
            patient: invite.patient._id, 
            parent: invite.patient.parent._id, 
            user: invite.patient.parent.user
          });
        } else {
          response(res, 403, null, noPermissions(this.model, req.params.id));
        }
      });
  }
  
  public updateInvite(data, req: Request, res: Response, next: NextFunction): void {
    const {invite, payload, patient} = data;
    const {owner} = payload;
    
    invite.update({ status: STATUS_ACCEPTED, updatedAt: unix() }, err => {
      if (err) return panic(res, err, 400);

      LocalDoctor.schema.findOneAndUpdate(
        { patient: patient._id, email: owner.user.email }, 
        { $set: { doctor: owner._id, updatedAt: unix() } }, 
        { new: true }
      , err => {
        if (err) return panic(res, err, 400);
        
        response(res, 200, invite);
        next({
          user: invite.patient.parent.user,
          title: 'Request accepted',
          message: `Doctor ${owner.firstName} ${owner.lastName} accepted your invite.`,
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
  
  public reject(data, req: Request, res: Response, next: NextFunction): void {
    const {owner} = data;
    
    this.model.schema
      .findOneAndUpdate(
        { _id: req.params.id, doctor: owner._id }, 
        { $set: { status: STATUS_REJECTED, updatedAt: unix() } }, 
        { new: true }
      )
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
          switch (get(invite, 'status')) {
            case STATUS_REJECTED: return response(res, 200, { message: 'Invite already rejected.' });
            case STATUS_CANCELLED: return response(res, 200, { message: 'Invite canceled by parent' });
          }

          response(res, 200, invite);
          next({
            user: invite.patient.parent.user,
            title: `Request rejected`,
            message: `Doctor ${owner.firstName} ${owner.lastName} reject your invite.`,
            payload: {
              _id: invite._id,
              patientId: invite.patient._id.toString(),
              status: NOTIFICATION_STATUS_INFO,
              type: NOTIFICATION_INVITE
            }
          });
        } else {
          response(res, 403, null, noPermissions(this.model, req.params.id));
        }
      }
    );
  }

  public cancel(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;

    this.model.schema
      .findOne({ _id: req.params.id, parent: owner._id })
      .populate('patient')
      .populate('parent')
      .exec((err, invite) => {
        if (err) return panic(res, err);

        if (invite) {
          switch (get(invite, 'status')) {
            case STATUS_DRAFT: return response(res, 400, null, { message: 'You can not cancel invite because it is draft.' });
            case STATUS_IN_PROGRESS: return response(res, 400, null, { message: 'You can not cancel the invitation because it is in progress.' });
            case STATUS_CANCELLED: return response(res, 400, null, { message: 'Invite already cancelled.' });
            case STATUS_FAILED: return response(res, 400, null, { message: 'You can\'t cancel failed invite.' })
            default:
              invite.update({ status: STATUS_CANCELLED, updatedAt: unix() }, err => {
                if (err) return panic(res, err);
        
                next({ invite, payload });
              });
          }
        } else {
          response(res, 403, null, noPermissions(this.model, req.params.id));
        }
      }
    );
  }

}
