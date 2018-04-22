import { OwnerController } from '../../base';
import { Request, Response, NextFunction } from '../../interfaces';
import { response, unix, noPermissions, panic } from '../../utils';
import { get, isEmpty, isEqual, isNumber } from 'lodash';
import Patient from '../patient/model';
import Repository from '../repository/model';
import QuickTest from '../quick-test/model';
import { NOTIFICATION_QUICK_TEST } from '../../firebase';
import { QUICK_TESTS_DIR } from '../repository/schema';

export default new class QuickTestsController extends OwnerController {

  public model = this.use('model');
  
  public count(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner, role} = payload;
    let condition;
    
    switch (role) {
      case global.ROLE_DOCTOR: condition = { doctors: { $in: [owner._id] } }; break;
      case global.ROLE_PARENT: condition = { parent: owner._id }; break;
    }

    Patient.schema.find(condition, (err, patients) => {
      if (err) return panic(res, err);

      this.model.schema
        .find({'patient': { $in: patients } })
        .exec((err, quickTests) => {
          if (err) return panic(res, err);

          response(res, 200, { count: quickTests.length });
        });
    });
  }
  
  public patientCount(data, req: Request, res: Response, next: NextFunction): void {
    const {payload, patient} = data;
    const {owner, role} = payload;

    this.model.schema
      .find({ patient })
      .exec((err, quickTests) => {
        if (err) return panic(res, err);

        response(res, 200, { count: quickTests.length });
      });
  }
  
  public detail(data, req: Request, res: Response, next: NextFunction): void {
    const {instance} = data;

    response(res, 200, instance);
  }
  
  public view(data, req: Request, res: Response, next: NextFunction): void {
    const {instance} = data;

    instance.update({ viewed: true }, err => {
      if (err) return panic(res, err);

      instance.viewed = true;
      response(res, 202, instance);
    });
  }
  
  public insert(data, req: Request, res: Response, next: NextFunction): void {
    const {payload, patient} = data;
    const {owner} = payload;
    const {patientId} = req.params;
    const {origin, createdAt} = req.body;
    
    Repository.saveFile(owner.user, QUICK_TESTS_DIR, origin, (err, path) => {
      if (err) return response(res, err.code || 400, null, err);
      
      const data = {
        ...req.body,
        originUrl: path,
        updatedAt: createdAt,
        patient: patient._id,
      };

      this.model.create(data, (err, quickTest) => {
        if (err) return panic(res, err);

        patient.update({ lastQuickTest: quickTest.createdAt, updatedAt: unix() }, err => {
          if (err) return panic(res, err);

          response(res, 201, quickTest);

          if (!quickTest.isPositive) {
            next({
              user: get(patient.doctor, 'user'),
              title: `New Quick Test`,
              message: `You have new Quick test result from patient ${patient.fullName}`,
              payload: {
                _id: quickTest._id,
                type: NOTIFICATION_QUICK_TEST,
              }
            });
          }
        });
      });
  });
  }

  public paginate(payload, req: Request, res: Response, next?: NextFunction): void {
    const {owner, role} = payload;
    let {page, pageSize}: any = req.params;

    if (!Number(page)) {
      return response(res, 400, null, { message: 'Parameter \'page\' should be a number.' });
    }

    page = Number(page);
    pageSize = Number(pageSize);
    let condition;
    
    switch (role) {
      case global.ROLE_DOCTOR: condition = { doctors: { $in: [owner._id] } }; break;
      case global.ROLE_PARENT: condition = { parent: owner._id }; break;
    }

    Patient.schema.find(condition, (err, patients) => {
      if (err) return panic(res, err);

      const query = this.model.schema.find({'patient': { $in: patients }});
        
      if (!isNaN(pageSize) && isNumber(pageSize)) {
        query
          .limit(pageSize)
          .skip((page - 1) * pageSize);
      }
        
      query
        .populate('patient')
        .sort({ updatedAt: -1 })
        .exec((err, quickTests) => {
          if (err) return panic(res, err);

          response(res, 200, quickTests);
        });
    });
  }
  
  public fetchNegative(payload, req: Request, res: Response, next: NextFunction): void {
    const {owner, role} = payload;
    let condition;
    
    switch (role) {
      case global.ROLE_DOCTOR: condition = { doctors: { $in: [owner._id] } }; break;
      case global.ROLE_PARENT: condition = { parent: owner._id }; break;
    }

    Patient.schema.find(condition, (err, patients) => {
      if (err) return panic(res, err);

      this.model.schema
        .find({'patient': { $in: patients }, isPositive: false })
        .populate('patient')
        .sort({ updatedAt: -1 })
        .exec((err, quickTests) => {
          if (err) return panic(res, err);

          response(res, 200, quickTests);
        });
    });
  }

  public remove(data, req: Request, res: Response, next: NextFunction): void {
    const {instance} = data;

    instance.remove(err => {
      if (err) return panic(res, err);

      response(res, 202);
      Repository.removeFile(instance.originUrl);
    });
  }

}
