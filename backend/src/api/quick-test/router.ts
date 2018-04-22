import QuickTestsController from './controller';
import RepositoryController from '../repository/controller';
import { Authorized, Parent, Doctor } from '../../guarders';
import { GetOwner, Notify, GetPatient, GetInstance } from '../../middlewares';
import Validator from './validator';

export default require('express').Router()

  /**
   * @method post
   * @type json
   * 
   * @param clientId {string} !
   * @param ph {string} !
   * @param ketone {string} !
   * @param glucose {string} !
   * @param isPositive {boolean} !
   * @param origin {string} !
   * @param createdAt {int} !
   */
  .post(
    '/:patientId',
    Parent,
    Validator,
    RepositoryController.validate.bind(RepositoryController),
    GetOwner,
    GetPatient.bind({ doctorWithUser: true }),
    QuickTestsController.insert.bind(QuickTestsController),
    Notify
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/negative',
    Authorized,
    GetOwner,
    QuickTestsController.fetchNegative.bind(QuickTestsController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/:id',
    Authorized,
    GetOwner,
    GetInstance.bind({ model: QuickTestsController.model, combined: true }),
    QuickTestsController.detail.bind(QuickTestsController)
  )
  
  /**
   * @method delete
   * @type json
   */
  .delete(
    '/:id',
    Parent,
    GetOwner,
    GetInstance.bind({ model: QuickTestsController.model, parent: true }),
    QuickTestsController.remove.bind(QuickTestsController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/count',
    Authorized,
    GetOwner,
    QuickTestsController.count.bind(QuickTestsController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/:patientId/count',
    Authorized,
    GetOwner,
    GetPatient,
    QuickTestsController.patientCount.bind(QuickTestsController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/paginate/:page/:pageSize?',
    Authorized,
    GetOwner,
    QuickTestsController.paginate.bind(QuickTestsController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/:id/view',
    Doctor,
    GetOwner,
    GetInstance.bind({ model: QuickTestsController.model, doctor: true }),
    QuickTestsController.view.bind(QuickTestsController)
  )