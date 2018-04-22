import { get } from 'lodash';

export default function(instance: string, id: string) {
  let message = `You have no permission for operation with id: ${id}`;
  let modelName = get(instance, 'schema.modelName');

  if (modelName) {
    message = `You have no permission for operation with ${modelName} instance where id: '${id}'`
  }
  
  return { 
    message
  };
}