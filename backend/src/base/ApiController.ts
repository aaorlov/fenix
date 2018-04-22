import Controller from './Controller';
import { response } from '../utils';
import { Request, Response, NextFunction } from '../interfaces';

export default class ApiController extends Controller {
  
  
  /**
   * Show all rows
   * 
   * @param {object} req 
   * @param {object} res 
   * @memberof ApiController
   */
  public index(req: Request, res: Response, next?: NextFunction): void {
    this.model.schema.find({}, (err, result) => {
      if (err) return response(res, 500, null, err);
      
      response(res, 200, result);
    });
  }


  /**
   * Show row taken by id
   * 
   * @param {object} req 
   * @param {object} res 
   * @memberof ApiController
   */
  public show(req: Request, res: Response, next?: NextFunction): void {
    this.model.findById(req.params.id, (err, result) => {
      if (result) {
        response(res, 200, result);
      } else {
        response(res, 404);
      }
    });
  }


  /**
   * Create row
   * 
   * @param {object} req 
   * @param {object} res 
   * @memberof ApiController
   */
  public create(req: Request, res: Response, next?: NextFunction): void {
    this.model.create(req.body, (err, result) => {
      if (err) return response(res, 500, null, err);

      response(res, 200, result);
    });
  }


  /**
   * Upgrade parts of row
   * 
   * @param {object} req 
   * @param {object} res 
   * @memberof ApiController
   */
  public patch(req: Request, res: Response, next?: NextFunction): void {
    this.model.update(req.params.id, req.body, (err, result) => {
      if (err) return response(res, 500, null, err);

      response(res, 200, err ? err : result);
    });
  }


  /**
   * Update row
   * 
   * @param {object} req 
   * @param {object} res 
   * @memberof ApiController
   */
  public update(req: Request, res: Response, next?: NextFunction): void {
    this.model.update(req.params.id, req.body, (err, result) => {
      if (err) return response(res, 500, null, err);

      response(res, 200, result);
    });
  }


  /**
   * Remove row
   * 
   * @param {object} req 
   * @param {object} res 
   * @memberof ApiController
   */
  public destroy(req: Request, res: Response, next?: NextFunction): void {
    this.model.destroy(req.params.id, (err, result) => {
      if (err) return response(res, 500, null, err);

      response(res, 200, result);
    });
  }


  /**
   * Limit rows
   * 
   * @param {object} req 
   * @param {object} res 
   * @memberof ApiController
   */
  public limit(req: Request, res: Response, next?: NextFunction): void {
    this.model.limit(req.params.count, (err, result) => {
      if (err) return response(res, 500, null, err);

      response(res, 200, result);
    });
  }

}