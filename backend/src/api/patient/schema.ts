import mongoose = require('mongoose');
import { unix } from '../../utils';
import { FullName } from '../../validators';

export const BLOOD_TYPES = [
  ' ',
  'I (O) +',
  'I (O) -',
  'II (A) +',
  'II (A) -',
  'III (B) +',
  'III (B) -',
  'IV (AB) +',
  'IV (AB) -'
];

export default {
  clientId: {
    type: String,
    required: true
  },
  
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true
  },

  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],

  fullName: {
    type: String,
    required: true,
    min: 2,
    max: 254,
    validate: FullName
  },

  weight: {
    type: Number,
    required: true
  },

  height: {
    type: Number,
    required: true
  },

  bloodType: {
    type: String,
    required: true,
    enum: BLOOD_TYPES
  },
  
  bloodTypeIndex: {
    type: Number,
    required: true
  },
  
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female']
  },

  birthday: {
    type: Number,
    required: true
  },
  
  avatarUrl: {
    type: String
  },
  
  avatarThumbnailUrl: {
    type: String
  },
  
  lastQuickTest: {
    $: 'int (unix)',
    type: Number
  },
  
  createdAt: {
    $: 'int (unix)',
    type: Number,
    default: unix()
  },

  updatedAt: {
    $: 'int (unix)',
    type: Number,
    default: unix()
  }
};