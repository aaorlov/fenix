import mongoose = require('mongoose');
import { unix } from '../../utils';

export const PRIVATE_DIR = 'private';
export const QUICK_TESTS_DIR = 'quick-tests';

export default {
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