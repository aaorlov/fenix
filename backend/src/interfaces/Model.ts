import mongoose = require('mongoose');

export default interface Model {
  schema: mongoose.Model<mongoose.Document>;

  fetch(callback: (err: any, result: any) => void, condition?: object): void;
  find(condition: object, callback?: (err: any, result: any) => void): void;
  findById(id: string, callback?: (err: any, result: any) => void): void;
  create(data: object, callback?: (err: any, result: any) => void): void;
  update(id: string, data: object, callback?: (err: any, result: any) => void): void;
  destroy(id: string, callback?: (err: any, result: any) => void): void;
  limit(count: string, callback: (err: any, result: any) => void, condition?: object): void;
  paginateSync(page, pageSize, condition: any): void;

  save(err, data?: any)
  validateSync()
}