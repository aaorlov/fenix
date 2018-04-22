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

  phoneNumber: {
    type: String,
    required: true
  },

  doctors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  }],

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