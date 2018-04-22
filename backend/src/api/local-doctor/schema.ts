import mongoose = require('mongoose');
import { unix } from '../../utils';
import { OnlyLetters } from '../../validators/index';

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

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },

  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 70,
    validate: OnlyLetters
  },

  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 70,
    validate: OnlyLetters
  },

  phoneNumber: {
    type: String,
    required: true,
    minlength: 5
  },

  position: {
    type: String,
    required: true,
    minlength: 3,
    validate: OnlyLetters
  },

  address: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },

  email: {
    type: String,
    maxlength: 255
  },

  avatarUrl: {
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