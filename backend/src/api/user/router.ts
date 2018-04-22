import UsersController from './controller';
import { Authorized } from '../../guarders';
import { GetOwner } from '../../middlewares';

export default require('express').Router()
  
  /**
   * @method get
   * @type json
   * 
   */
  .get(
    '/', 
    Authorized, 
    GetOwner,
    UsersController.own.bind(UsersController)
  )