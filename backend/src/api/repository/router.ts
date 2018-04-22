import RepositoryController from './controller';
import { Authorized } from '../../guarders';
import { GetOwner } from '../../middlewares';

export default require('express').Router()
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/:userId/:dir/:filename',
    Authorized,
    GetOwner,
    RepositoryController.sendFile.bind(RepositoryController)
  )
    
  /**
   * @method get
   * @type json
   */
  .get(
    '/:userId/:filename',
    Authorized,
    GetOwner,
    RepositoryController.sendFile.bind(RepositoryController)
  )
  
  /**
   * @method delete
   * @type json
   */
  .delete(
    '/:userId/:dir/:filename',
    Authorized,
    GetOwner,
    RepositoryController.removeFile.bind(RepositoryController)
  )
    
  /**
   * @method delete
   * @type json
   */
  .delete(
    '/:userId/:filename',
    Authorized,
    GetOwner,
    RepositoryController.removeFile.bind(RepositoryController)
  )
  
  /**
   * @method get
   * @type json
   */
  .get(
    '/stats',
    Authorized,
    RepositoryController.stats.bind(RepositoryController)
  )