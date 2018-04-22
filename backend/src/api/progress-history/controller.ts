import { ApiController } from '../../base';
import Model from './model';
import Patient from '../patient/model';
import Parent from '../parent/model';
import Invite from '../invite/model';
import { Request, Response, NextFunction } from '../../interfaces';
import { response, noPermissions, panic } from '../../utils';
import { isEmpty, last, merge, get, isEqual } from 'lodash';
import { HEIGHT, WEIGHT } from './schema';
import { STATUS_ACCEPTED } from '../invite/schema';
import ProgressHistory from './interface';
import { prependListener } from 'cluster';

export default new class ProgressHistoryController extends ApiController {
  
  public model = this.use('model');

  public remove(data, req: Request, res: Response, next: NextFunction): void {
    const {instance} = data;

    instance.remove(err => {
      if (err) return panic(res, err);

      response(res, 202);
    });
  }

  public overPatch(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner} = payload;
    const {id} = req.params;
    const {type} = req.body;

    this.model.schema.findById(id).populate('patient').exec((err, progressHistory) => {
      if (err) return panic(res, err);

      if (progressHistory && isEqual(get(progressHistory, 'patient.parent'), owner._id)) {
        this.model.update(id, { [type]: req.body[type] }, (err, progressHistory) => {
          if (err) return panic(res, err, 400);

          response(res, 200, progressHistory);
        });
      } else {
        response(res, 403, null, noPermissions(this.model, id))
      }
    });
  }

  public fetchHeight(data, req: Request, res: Response, next: NextFunction): void {
    const {patient} = data;

    this.model.schema.find({ patient, type: HEIGHT }, (err, progressHistory) => {
      if (err) return panic(res, err);

      response(res, 200, progressHistory);
    });
  }

  public fetchWeight(data, req: Request, res: Response, next: NextFunction): void {
    const {patient} = data;

    this.model.schema.find({ patient, type: WEIGHT }, (err, progressHistory) => {
      if (err) return panic(res, err);

      response(res, 200, progressHistory);
    });
  }

  public defineType(req: Request, res: Response, next: NextFunction): void {
    delete req.body.type;

    if (req.body.height) {
      req.body.type = HEIGHT;
    } else if (req.body.weight) {
      req.body.type = WEIGHT;
    }
    
    next();
  }

  public insert(data, req: Request, res: Response, next: NextFunction): void {
    const {payload, patient} = data;
    const {owner, role} = payload;
    const {type, createdAt} = req.body;
    
    const object = {
      ...req.body,
      patient: patient._id,
      updatedAt: createdAt
    };

    switch (type) {
      case HEIGHT:
        this.model.schema.find({}).where('height').gt(0).exec((err, progressHistory) => {
          if (err) return panic(res, err);

          if (progressHistory.length > 0) {
            const lastRecord: ProgressHistory = last(progressHistory);

            if (object.height >= lastRecord.height) {
              this.writeHistory(res, object, type, lastRecord._id);
            } else {
              return response(res, 400, null, { message: `Field 'height' must be greater than last 'height' value: '${lastRecord.height}'.` });
            }
          } else {
            this.writeHistory(res, object, type);
          }
        });
        break;
      case WEIGHT: 
        this.writeHistory(res, object, type);
        break;
    }
  }

  private writeHistory(res: Response, data, type, id = null) {
    this.model.create(data, (err, progressHistory) => {
      if (err) return panic(res, err, 400);

      this.model.schema.findById(id || progressHistory._id, (err, progressHistory) => {
        if (err) return panic(res, err);

        Patient.update(progressHistory.patient, { [type]: data[type] }, (err, patient) => {
          if (err) return panic(res, err, 400);

          merge(progressHistory, { patient });
          response(res, 201, progressHistory);
        });
      });
    });
  }

}
