import DoctorsController from './controller';
import { Doctor } from '../../guarders';
import { GetOwner } from '../../middlewares';

export default require('express').Router()
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/', 
    Doctor, 
    GetOwner, 
    DoctorsController.own.bind(DoctorsController)
  )
  
  /**
   * @method patch
   * @type json
   * 
   * @param firstName {string}
   * @param lastName {string}
   * @param position {string}
   * @param address {string}
   * @param phoneNumber {string}
   * @param origin {base64}
   */
  .patch(
    '/', 
    Doctor, 
    GetOwner, 
    DoctorsController.overPatch.bind(DoctorsController),
    DoctorsController.forceUpdate.bind(DoctorsController)
  )

  /**
   * @method get
   * @type json
   */
  .get(
    '/patients',
    Doctor,
    GetOwner,
    DoctorsController.patients.bind(DoctorsController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/patients/count',
    Doctor,
    GetOwner,
    DoctorsController.patientsCount.bind(DoctorsController)
  )

  /**
   * @method get
   * @type json
   */
  .get(
    '/invites',
    Doctor,
    GetOwner,
    DoctorsController.invites.bind(DoctorsController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/invites/count',
    Doctor,
    GetOwner,
    DoctorsController.invitesCount.bind(DoctorsController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/last-invite',
    Doctor,
    GetOwner,
    DoctorsController.lastInvite.bind(DoctorsController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/new-quick-tests/count',
    Doctor,
    GetOwner,
    DoctorsController.newQuickTestsCount.bind(DoctorsController)
  )