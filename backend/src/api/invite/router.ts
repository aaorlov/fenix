import InvitesController from './controller';
import ParentsController from '../parent/controller';
import PatientsController from '../patient/controller';
import { Parent, Doctor } from '../../guarders';
import { GetOwner, GetPatient, Notify } from '../../middlewares';

export default require('express').Router()

  /**
   * @method post
   * @type json
   * 
   * @param email {string} !
   * @param patientId {string} !
   */
  .post(
    '/doctor',
    Parent,
    InvitesController.validate.bind(InvitesController),
    GetOwner,
    GetPatient.bind({ parentWithUser: true }),
    InvitesController.registerInvite.bind(InvitesController),
    InvitesController.prepareInvite.bind(InvitesController),
    InvitesController.invite.bind(InvitesController),
    Notify
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/:id/accept',
    Doctor,
    GetOwner,
    InvitesController.accept.bind(InvitesController),
    ParentsController.addDoctor.bind(ParentsController),
    PatientsController.addDoctor.bind(PatientsController),
    InvitesController.updateInvite.bind(InvitesController),
    Notify
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/:id/reject',
    Doctor,
    GetOwner,
    InvitesController.reject.bind(InvitesController),
    Notify
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/:id/cancel',
    Parent,
    GetOwner,
    InvitesController.cancel.bind(InvitesController),
    ParentsController.removeDoctor.bind(ParentsController),
    PatientsController.removeDoctor.bind(PatientsController),
    Notify
  )