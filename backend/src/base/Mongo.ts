import mongoose = require('mongoose');
import express = require('express');
import { config } from '../utils';

export default class Mongo {

  /**
   * MongoDB connection in memory;
   * 
   * @memberof Mongo
   */

  private static connection;


  /**
   * Connect to MongoDB
   * 
   * @static
   * @returns 
   * @memberof Mongo
   */
  public static connect(): any {
    if (!Mongo.connection) {
      Mongo.connection = mongoose.connect(config('database').MONGODB_URL);
    }

    return Mongo.connection;
  }


  /**
   * Disconnect from MongoDB
   * 
   * @static
   * @memberof Mongo
   */
  public static disconnect(callback = () => {}): void {
    mongoose.connection.close(() => {
      Mongo.connection = null;
      callback();
    });
  }

}