import mongoose = require('mongoose');
import { unix } from '../../utils';
import { OnlyLetters } from '../../validators';

export default {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  firstName: {
    type: String,
    required: true,
    min: 2,
    max: 254,
    validate: OnlyLetters
  },

  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 254,
    validate: OnlyLetters
  },

  position: {
    type: String,
    require: true,
    min: 3,
    max: 254
  },

  address: {
    type: String,
    required: true,
    min: 3,
    max: 254
  },
  
  phoneNumber: {
    type: String,
    required: true,
    min: 5,
    max: 254
  },

  avatarUrl: {
    type: String
  },

  avatarThumbnailUrl: {
    type: String
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