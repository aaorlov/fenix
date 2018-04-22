import { upperFirst, camelCase } from 'lodash';

export default argument => (
  `import { Model } from '../../base';
  import Schema from './schema';
  
  class ${upperFirst(camelCase(argument))} extends Model {}
  
  export default new ${upperFirst(camelCase(argument))}('${upperFirst(camelCase(argument))}', Schema);
  `
);
