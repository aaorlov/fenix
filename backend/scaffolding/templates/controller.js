import { upperFirst, camelCase } from 'lodash';

export default argument => (
  `import { ApiController } from '../../base';
  import { Request, Response, NextFunction } from '../../interfaces';
  import { response, panic } from '../../utils';
  
  export default new class ${upperFirst(camelCase(argument))}Controller extends ApiController {
  
    public model = this.use('model');
  
  }
  `
);
