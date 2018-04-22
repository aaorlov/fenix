export default `import mongoose = require('mongoose');
  import { unix } from '../../utils';
  
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
  };`;
