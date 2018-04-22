import { ApiController } from '../../base';
import Parent from '../parent/model';
import Invite from '../invite/model';
import { Request, Response, NextFunction } from '../../interfaces';
import { response, projectDir, config, panic } from '../../utils';
import { isEmpty, isEqual } from 'lodash';
import { PRIVATE_DIR } from './schema';
import { STATUS_SENT } from '../invite/schema';

const fs = require('fs');
const getDirSize = require('get-folder-size');
const repositoryDir = config('app').REPOSITORY.DIR;

export default new class RepositoryController extends ApiController {

  public model = this.use('model');

  public createDir(payload, req: Request, res: Response, next: NextFunction): void {
    this.model.createDir(payload.user, err => {
      if (err) return panic(res, err);

      next(payload);
    });
  }

  public createAvatarFile(payload, req: Request, res: Response, next: NextFunction): void {
    const {user, role} = payload;
    const {origin} = req.body;

    if (origin) {
      this.model.saveFileWithThumbnail(user, '', origin, 50, (err, paths) => {
        if (err) return panic(res, err);
        
        payload[role].update({ avatarUrl: paths.url, avatarThumbnailUrl: paths.thumbnailUrl }, err => {
          if (err) return panic(res, err);

          next(payload);
        });
      }, 'avatar');
    } else {
      next(payload)
    }
  }
  
    public createFile(payload, req: Request, res: Response, next: NextFunction): void {
      const {user, instance, filename, dir, field} = payload;
      const {origin} = req.body;
  
      if (origin) {
        this.model.saveFile(user, dir || '', origin, (err, path) => {
          if (err) return panic(res, err);
          
          instance.update({ [field]: path }, err => {
            if (err) return panic(res, err);
  
            instance[field] = path;
            next(payload);
          });
        }, filename);
      } else {
        next(payload)
      }
    }

  public sendFile(payload, req: Request, res: Response, next: NextFunction): void {
    let {userId, dir, filename} = req.params;    
    const {owner, role} = payload;
    const path = dir ? `${userId}/${dir}/${filename}` : `${userId}/${filename}`;
    let rightOperand = null;

    if (owner.user._id.toString() === userId.toString()) {
      return res.sendFile(`${projectDir}/${repositoryDir}/${path}`, err => {
        if (err) return response(res, 404);
      });
    }
    
    if (role === global.ROLE_DOCTOR) {
      rightOperand = owner.user._id.toString();
    } else if (role === global.ROLE_PARENT) {
      rightOperand = userId;
      userId = owner.user._id;
    }
    
    if (rightOperand && (!dir || dir !== PRIVATE_DIR)) {
      Parent.schema.findOne({ user: userId }).populate('doctors').exec((err, parent) => {
        if (err) return panic(res, err);
        if (!parent) return response(res, 403);

        if (parent.doctors.length >= 1) {
          return fromPatients(parent);
        } else if (role === global.ROLE_DOCTOR) {
          return fromInvites(parent);
        }
          
        response(res, 403);
      });
    } else {
      response(res, 403);
    }

    function fromPatients(parent) {
      const access = parent.doctors.filter(doctor => {
        return doctor.user.toString() === rightOperand;
      }).shift();

      if (!isEmpty(access)) {
        return res.sendFile(`${projectDir}/${repositoryDir}/${path}`, err => err && response(res, 404));
      } else {
        response(res, 403);
      }
    }

    function fromInvites(parent) {
      Invite.schema.find({ parent: parent._id, doctor: owner._id }, (err, invites) => {
        let access = false;

        invites.forEach(invite => {
          if (invite.status === STATUS_SENT) {
            access = true;
          }
        });

        if (access) {
          res.sendFile(`${projectDir}/${repositoryDir}/${path}`, err => err && response(res, 404));
        } else {
          response(res, 403);
        }
      });
    }
  }

  public removeFile(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner, role} = payload;
    const {userId, dir, filename} = req.params;
    const path = dir ? `${userId}/${dir}/${filename}` : `${userId}/${filename}`;

    if (isEqual(userId, owner.user._id.toString())) {
      this.model.removeFile(path, err => {
        if (err) return panic(res, err);

        response(res, 202);
      });
    } else {
      response(res, 403);
    }
  }

  public stats(req: Request, res: Response): void {
    getDirSize(repositoryDir, (err, size) => {
      if (err) return panic(res, err);
     
      response(res, 200, { 
        users: fs.readdirSync(repositoryDir).length,
        size: {
          bytes: size, 
          megabytes: Number((size / 1000 / 1000).toFixed(2))
        }
      });
    });
  }

  public validate(req: Request, res: Response, next: NextFunction): void {
    const {origin} = req.body;

    if (origin.split(',').length > 1) {
      next();
    } else {
      response(res, 400, null, { message: 'Invalid base64.' });
    }
  }

}
