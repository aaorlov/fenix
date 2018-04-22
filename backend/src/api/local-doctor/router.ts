import LocalDoctorController from './controller';
import RepositoryController from '../repository/controller';
import { Parent } from '../../guarders';
import { GetOwner, GetInstance, GetPatient } from '../../middlewares';

export default require('express').Router()

  /**
   * @method get
   * @type json
   */
  .get(
    '/',
    Parent,
    GetOwner,
    LocalDoctorController.fetch.bind(LocalDoctorController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/:id',
    Parent,
    GetOwner,
    LocalDoctorController.details.bind(LocalDoctorController)
  )

  /**
   * @method post
   * @type json
   * 
   * @param clientId {string} !
   * @param firstName {string} !
   * @param lastName {string} !
   * @param phoneNumber {string} !
   * @param position {string} !
   * @param address {string} !
   * @param email {string}
   * @param origin {base64}
   */
  .post(
    '/',
    Parent,
    GetOwner,
    LocalDoctorController.produce.bind(LocalDoctorController),
    RepositoryController.createFile.bind(RepositoryController),
    LocalDoctorController.sendResult.bind(LocalDoctorController)
  )

  /**
   * @method patch
   * @type json
   * 
   * @param clientId {string}
   * @param babyId {string}
   * @param firstName {string}
   * @param lastName {string}
   * @param phoneNumber {string}
   * @param position {string}
   * @param address {string}
   * @param email {string}
   * @param origin {base64}
   */
  .patch(
    '/:id',
    Parent,
    GetOwner,
    LocalDoctorController.overPatch.bind(LocalDoctorController),
    RepositoryController.createFile.bind(RepositoryController),
    LocalDoctorController.sendResult.bind(LocalDoctorController)
  )

  /**
   * @method delete
   * @type json
   */
  .delete(
    '/:id',
    Parent,
    GetOwner,
    LocalDoctorController.remove.bind(LocalDoctorController)
  )