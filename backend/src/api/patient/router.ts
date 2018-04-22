import PatientsController from './controller';
import { Authorized, Parent, Doctor } from '../../guarders';
import { GetOwner, GetPatient } from '../../middlewares';

export default require('express').Router()

  /**
   * @method post
   * @type json
   * 
   * @param clientId {string} !
   * @param fullName {string} !
   * @param weight {double} !
   * @param height {double} !
   * @param bloodTypeIndex {int} !
   * @param gender {string} !
   * @param birthday {int} !
   * @param origin {base64}
   */
  .post(
    '/',  
    Parent,   
    GetOwner,
    PatientsController.validate.bind(PatientsController), 
    PatientsController.insert.bind(PatientsController),
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/:id',
    Authorized,
    GetOwner,
    PatientsController.detail.bind(PatientsController)
  )

  /**
   * @method patch
   * @type json
   * 
   * @param fullName {string}
   * @param weight {double}
   * @param height {double}
   * @param bloodTypeIndex {int}
   * @param gender {string}
   * @param birthday {int}
   * @param origin {base64}
   */
  .patch(
    '/:id',  
    Parent,
    GetOwner,
    PatientsController.createAvatarFile.bind(PatientsController),
    PatientsController.overPatch.bind(PatientsController)
  )

  /**
   * @method delete
   * @type json
   */
  .delete(
    '/:id',
    Parent,
    GetOwner,
    GetPatient,
    PatientsController.remove.bind(PatientsController)
  )

  /**
   * @method get
   * @type json
   */
  .get(
    '/:id/quick-tests/:page/:pageSize?',
    Authorized,
    GetOwner,
    GetPatient,
    PatientsController.quickTestsPagination.bind(PatientsController)
  )
    
  /**
   * @method get
   * @type json
   */
  .get(
    '/:id/last-quick-test',
    Doctor,
    GetOwner,
    GetPatient,
    PatientsController.lastQuickTest.bind(PatientsController)
  )