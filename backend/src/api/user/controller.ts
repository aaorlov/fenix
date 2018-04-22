import { OwnerController } from '../../base';
import User from './interface';
import { response, panic } from '../../utils';
import { isEmpty } from 'lodash';
import { Request, Response, NextFunction } from '../../interfaces';
import { getFromBody } from '../../helpers';

export default new class UsersController extends OwnerController {

  public model = this.use('model');
  
  protected ownPath: string = 'user._id';

  public produce(req: Request, res: Response, next: NextFunction): void {
    const {email, password}: User = req.body;
    
    if (isEmpty(email) || isEmpty(password)) {
      this.model.create({ email, password }, err => response(res, 400, null, err));
    } else {
      this.model.encryptPassword(password, (err, hash) => {
        if (err) return panic(res, err);
  
        this.model.instance({ email, password: hash }, next);
      });
    }
  }

  public getFromBody(req: Request, res: Response, next: NextFunction): void {
    getFromBody(req, res, next);
  }

}