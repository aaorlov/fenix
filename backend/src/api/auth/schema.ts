import mongoose = require('mongoose');
import { unix } from '../../utils';

export default {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  token: {
    type: String,
    required: true,
    unique: true
  },

  deviceId: {
    type: String,
    required: true,
    // unique: true
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