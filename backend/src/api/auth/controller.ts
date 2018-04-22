import { ApiController } from '../../base';
import AuthInterface from './interface';
import UserInterface from '../user/interface';
import { response, mailer, panic } from '../../utils';
import { parseToken } from '../../helpers';
import { Request, Response, NextFunction } from '../../interfaces';
import { isEmpty, isString } from 'lodash';
import { forgetPasswordHTML } from '../../mailers';

export default new class AuthController extends ApiController {

  public model = this.use('model');

  public sendToken(data: AuthInterface, req: Request, res: Response, next: NextFunction): void {
    this.model.registerApiToken({ ...data, deviceId: req.body.deviceId }, (err, result) => {
      if (err) return panic(res, err);

      const {token} = result;
      
      res.set({ 'Authorization': `${this.model.headerPrefix}${token}` });        
      response(res, 201, { token });
    });
  }

  public comparePassword(user: UserInterface, req: Request, res: Response, next: NextFunction): void {
    const {password}: UserInterface = req.body;
  
    if (isEmpty(password)) {
      response(res, 400);
    } else {
      this.model.comparePassword(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) return response(res, 403);
  
        next(user);
      });
    }
  }

  public signOut(req: Request, res: Response): void {
    const token = parseToken(req);

    this.model.findOne({ token }, err => {
      if (err) return response(res, 401);

      this.model.removeTokenFromWhiteList(token, (err, status) => {
        response(res, status, null, err);
      });
    });
  }

  public forgetPassword(data: UserInterface, req: Request, res: Response, next: NextFunction): void {
    mailer(data.email, 'Forget password', 'some description', forgetPasswordHTML, (err, info) => {
      if (err) return panic(res, err);

      response(res, 200, info);
    });
  }

  public validate(req: Request, res: Response, next: NextFunction): void {
    const {deviceId}: AuthInterface = req.body;

    if (!isEmpty(deviceId)) {
      if (isString(deviceId)) {
        this.model.schema.remove({ deviceId }, () => next());
      } else {
        response(res, 400, null, { message: 'field \'deviceId\' should be a string' });
      }
    } else {
      response(res, 400, null, { message: 'field \'deviceId\' is required' });
    }
  }

  public verifyToken(req: Request, res: Response, next: NextFunction): void {
    response(res, 200);
  }

}