import mongoose = require('mongoose');
import { unix } from '../../utils';

export const STATUS_DRAFT: string = 'draft';
export const STATUS_IN_PROGRESS: string = 'in_progress';
export const STATUS_SENT: string = 'sent';
export const STATUS_REJECTED: string = 'rejected';
export const STATUS_ACCEPTED: string = 'accepted';
export const STATUS_FAILED: string = 'failed';
export const STATUS_CANCELLED: string = 'cancelled';

export default {
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true
  },

  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },

  receiver: {
    type: String,
    required: true
  },

  status: {
    type: String,
    required: true,
    default: STATUS_DRAFT
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