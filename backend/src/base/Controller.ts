import { Response } from '../interfaces';
import { response } from '../utils';

const callsite = require('callsite');

export default class Controller {

  /**
   * Model of the controller
   * 
   * @memberof Controller
   */
  public model;
    
  
  /**
   * Method for use some elements of the controller
   * 
   * @param element 
   * @memberof Controller
   */
  protected use(element: string) {
    const filename = callsite()[1].getFileName();
    const filenameArray = filename.split('/');
    const moduleName = filenameArray.slice(0, filenameArray.length - 1).join('/');
    const elementArray = element.split('/');

    if (elementArray.length > 1) {
      try {
        return require(`${moduleName}/${element}`).default.bind(this);
      } catch (exception) {
        return undefined;
      }
    } else {
      try {
        switch (element) {
          case 'model': return require(`${moduleName}/model`).default;
          default: return undefined;
        }
      } catch (exception) {
        return undefined;
      }
    }
  }

  protected response(res: Response, code: number, payload: any = null, err: Error = null) {
    response(res, code, payload, err);
  }

}