import { unix } from '../../utils';

export default {
  email: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 254
  },
  
  password: {
    type: String,
    required: true,
    hideJSON: true
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