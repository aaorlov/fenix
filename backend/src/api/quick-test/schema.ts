import mongoose = require('mongoose');

const type = {
  isPositive: Boolean,
  pointX: Number,
  pointY: Number,
  color: String,
};

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

  ph: {
    $: '{ "isPositive": boolean, "pointX": int, "pointY": int, "color": string (hex) }',
    type,
    required: true
  },

  ketone: {
    $: '{ "isPositive": boolean, "pointX": int, "pointY": int, "color": string (hex) }',
    type,
    required: true
  },

  glucose: {
    $: '{ "isPositive": boolean, "pointX": int, "pointY": int, "color": string (hex) }',
    type,
    required: true
  },

  isPositive: {
    type: Boolean,
    required: true
  },

  originUrl: {
    type: String,
    require: true
  },

  viewed: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    $: 'int (unix)',
    type: Number,
    requred: true
  },

  updatedAt: {
    $: 'int (unix)',
    type: Number,
    requred: true
  }
};