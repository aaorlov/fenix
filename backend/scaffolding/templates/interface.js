import { upperFirst, camelCase } from 'lodash';

export default argument => (
  `export default interface ${upperFirst(camelCase(argument))} {}`
);
