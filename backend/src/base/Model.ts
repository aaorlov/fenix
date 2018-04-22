import mongoose = require('mongoose');
import Mongo from './Mongo';
import { isEmpty, isNumber } from 'lodash';
import { unix } from '../utils';

export default class Model {

  /**
   * Schema of model
   * 
   * @memberof Model
   */
  public schema: mongoose.Model<mongoose.Document>;


  /**
   * Create scheme
   * 
   * @param {string} name 
   * @param {object} scheme 
   * @param {object} plugin
   * @param {number} index 
   * @returns 
   * @memberof Model
   */
  constructor(name: string, scheme: mongoose.Schema, altName?: string, plugin?: any, pluginOptions?: any, index?: string) {
    const schema = Mongo.connect().Schema(scheme);

    if (plugin) schema.plugin(plugin, pluginOptions);
    if (index) schema.index(index);
    
    try {
      if (altName) {
        this.schema = mongoose.model(name, schema, altName);
      } else {
        this.schema = mongoose.model(name, schema);
      }
    } catch (exception) {
      this.schema = mongoose.model(name);
    }
  }
  

  /**
   * Return instance of model
   * 
   * @param {object} data
   * @param {function} [callback=(err, result) => {}] 
   * @memberof Model
   */
  public instance(data: object, callback = (data: any) => {}): void {
    callback(new this.schema(data));
  }
  

  /**
   * Find a row by condition
   * 
   * @param {object} condition 
   * @param {function} [callback=(err, result) => {}] 
   * @memberof Model
   */
  public findOne(condition: object, callback = (err, result) => {}): void {
    this.schema.findOne(condition, callback);
  }


  /**
   * Find a row by id
   * 
   * @param {object} id 
   * @param {function} [callback=(err, result) => {}] 
   * @memberof Model
   */
  public findById(id: string, callback = (err, result) => {}): void {
    this.schema.findOne({ _id: id }, callback);
  }


  /**
   * Create new row
   * 
   * @param {object} data
   * @param {function} [callback=(err, result) => {}] 
   * @memberof Model
   */
  public create(data: object, callback = (err, result = null) => {}): void {
    const instance: any = new this.schema(data);
    const error = instance.validateSync();

    if (error) {
      callback(error);
    } else {
      instance.save(callback);
    }
  }


  /**
   * Update row by id
   * 
   * @param {string} id 
   * @param {object} data 
   * @param {function} [callback=(err, result) => {}] 
   * @memberof Model
   */
  public update(id: string, data: object, callback = (err, result) => {}): void {
    this.schema.findByIdAndUpdate(id, { $set: { ...data, updatedAt: unix() } }, { new: true }, callback);
  }


  /**
   * Destroy row by id
   * 
   * @param {string} id 
   * @param {function} [callback=(err, result) => {}] 
   * @memberof Model
   */
  public destroy(id: string, callback = (err, result) => {}): void {
    this.schema.findByIdAndRemove(id, callback);
  }
  

  /**
   * Limit rows
   * 
   * @param {string} count 
   * @param {function} callback 
   * @param {object} [condition={}] 
   * @memberof Model
   */
  public limit(count: string, callback = (err, result) => {}, condition: object = {}): void {
    this.schema.find(condition, callback).limit(Number(count));
  }

  public paginateSync(page, pageSize, condition) {
    if (!Number(page)) {
      return { code: 400, error: 'Parameter \'page\' should be a number.' };
    }

    page = Number(page);
    pageSize = Number(pageSize);

    const query = this.schema.find(condition);

    if (!isNaN(pageSize) && isNumber(pageSize)) {
      query
        .limit(pageSize)
        .skip((page - 1) * pageSize);
    }

    return { code: 200, query };
  }

}