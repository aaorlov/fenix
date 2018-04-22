import ParentsController from './controller';
import { Parent } from '../../guarders';
import { GetOwner } from '../../middlewares';

export default require('express').Router()
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/', 
    Parent, 
    GetOwner, 
    ParentsController.own.bind(ParentsController)
  )
  
  /**
   * @method patch
   * @type json
   * 
   * @param firstName {string}
   * @param lastName {string}
   * @param phoneNumber {string}
   * @param origin {base64}
   */
  .patch(
    '/',
    Parent, 
    GetOwner,
    ParentsController.createAvatarFile.bind(ParentsController),
    ParentsController.overPatch.bind(ParentsController),
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/patients',
    Parent, 
    GetOwner,
    ParentsController.patients.bind(ParentsController),
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/doctors',
    Parent, 
    GetOwner,
    ParentsController.doctors.bind(ParentsController),
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/invited-doctors',
    Parent, 
    GetOwner,
    ParentsController.invitedDoctors.bind(ParentsController),
  )