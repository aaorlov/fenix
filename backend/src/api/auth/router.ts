import AuthController from './controller';
import UsersController from '../user/controller';
import DoctorsController from '../doctor/controller';
import ParentsController from '../parent/controller';
import InvitesController from '../invite/controller';
import RepositoryController from '../repository/controller';
import { Guest, Authorized } from '../../guarders';

export default require('express').Router()
  
  /**
   * @method post
   * @type json
   * 
   * @param email {string} !
   * @param password {string} !
   * @param deviceId {string} !
   */
  .post(
    '/sign-in/doctor', 
    Guest, 
    AuthController.validate.bind(AuthController),
    UsersController.getFromBody.bind(UsersController),
    AuthController.comparePassword.bind(AuthController),
    DoctorsController.populate.bind(DoctorsController),
    AuthController.sendToken.bind(AuthController)
  )

  /**
   * @method post
   * @type json
   * 
   * @param email {string} !
   * @param password {string} !
   * @param firstName {string} !
   * @param lastName {string} !
   * @param position {string} !
   * @param address {string} !
   * @param phoneNumber {string} !
   * @param deviceId {string} !
   * @param origin {base64}
   */
  .post(
    '/sign-up/doctor', 
    Guest,
    AuthController.validate.bind(AuthController),
    UsersController.produce.bind(UsersController),
    DoctorsController.produce.bind(DoctorsController),
    RepositoryController.createDir.bind(RepositoryController),
    RepositoryController.createAvatarFile.bind(RepositoryController),
    InvitesController.assign.bind(InvitesController),
    AuthController.sendToken.bind(AuthController)
  )
  
  /**
   * @method post
   * @type json
   * 
   * @param email {string} !
   * @param password {string} !
   * @param deviceId {string} !
   */
  .post(
    '/sign-in/parent', 
    Guest, 
    AuthController.validate.bind(AuthController),
    UsersController.getFromBody.bind(UsersController),
    AuthController.comparePassword.bind(AuthController),
    ParentsController.populate.bind(ParentsController),
    AuthController.sendToken.bind(AuthController)
  )
  
  /**
   * @method post
   * @type json
   * 
   * @param email {string} !
   * @param password {string} !
   * @param firstName {string} !
   * @param lastName {string} !
   * @param phoneNumber {string} !
   * @param deviceId {string} !
   * @param origin {base64}
   */
  .post(
    '/sign-up/parent', 
    Guest, 
    AuthController.validate.bind(AuthController),
    UsersController.produce.bind(UsersController),
    ParentsController.produce.bind(ParentsController),
    RepositoryController.createDir.bind(RepositoryController),
    RepositoryController.createAvatarFile.bind(RepositoryController),
    AuthController.sendToken.bind(AuthController)
  )

  /**
   * @method get
   * @type json
   */
  .get(
    '/sign-out',
    Authorized, 
    AuthController.signOut.bind(AuthController)
  )

  /**
   * @method get
   * @type json
   */
  .get(
    '/verify-token',
    Authorized, 
    AuthController.verifyToken.bind(AuthController)
  )

  /**
   * @method post
   * @type json
   * 
   * @param email {string} !
   */
  // .post(
  //   '/forget',
  //   Guest,
  //   UsersController.getFromBody.bind(UsersController),
  //   AuthController.forgetPassword.bind(AuthController)
  // )
