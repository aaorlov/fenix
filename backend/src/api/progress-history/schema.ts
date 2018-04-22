import mongoose = require('mongoose');
import Model from './model';

export const WEIGHT = 'weight';
export const HEIGHT = 'height';

export default {
  clientId: {
    type: String,
    required: true
  },
  
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },

  weight: {
    type: Number
  },

  height: {
    type: Number
  },

  type: {
    type: String,
    required: true,
    enum: [WEIGHT, HEIGHT]
  },
  
  createdAt: {
    $: 'int (unix)',
    type: Number,
    required: true
  },

  updatedAt: {
    $: 'int (unix)',
    type: Number,
    required: true
  }
};