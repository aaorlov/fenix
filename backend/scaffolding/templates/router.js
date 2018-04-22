import { upperFirst, camelCase } from 'lodash';

export default argument => (
  `import ${upperFirst(camelCase(argument))}Controller from './controller';
  
  export default require('express').Router()
  `
);
