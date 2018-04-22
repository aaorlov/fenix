import ProgressHistoryController from './controller';
import { Parent, Authorized } from '../../guarders';
import { GetOwner, GetPatient, GetInstance } from '../../middlewares';
import Validator from './validator';

export default require('express').Router()

  /**
   * @method post
   * @type json
   * 
   * @param clientId {string} !
   * @param height {double}
   * @param weight {double}
   * @param createdAt {int} !
   */
  .post(
    '/:patientId',
    Parent,
    Validator,
    ProgressHistoryController.defineType.bind(ProgressHistoryController),
    GetOwner,
    GetPatient,
    ProgressHistoryController.insert.bind(ProgressHistoryController)
  )
  
  /**
   * @method patch
   * @type json
   * 
   * @param height {double}
   * @param weight {double}
   */
  .patch(
    '/:id',
    Parent,
    Validator,
    ProgressHistoryController.defineType.bind(ProgressHistoryController),
    GetOwner,
    ProgressHistoryController.overPatch.bind(ProgressHistoryController)
  )

  /**
   * @method delete
   * @type json
   */
  .delete(
    '/:id',
    Parent,
    GetOwner,
    GetInstance.bind({ model: ProgressHistoryController.model, parent: true }),
    ProgressHistoryController.remove.bind(ProgressHistoryController)
  )

  /**
   * @method get
   * @type json
   */
  .get(
    '/:patientId/height',
    Authorized,
    GetOwner,
    GetPatient,
    ProgressHistoryController.fetchHeight.bind(ProgressHistoryController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/:patientId/weight',
    Authorized,
    GetOwner,
    GetPatient,
    ProgressHistoryController.fetchWeight.bind(ProgressHistoryController)
  )