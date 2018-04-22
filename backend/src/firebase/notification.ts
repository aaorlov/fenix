import admin from './admin';
import { omit, merge, isEmpty } from 'lodash';

export default function(deviceId: string, payload: any, callback = (err: any, result: any = null) => {}): void {
  const {body} = payload;
  const notification = {
    title: payload.title
  };

  if (!isEmpty(body)) merge(notification, { body })
  
  admin
    .messaging()
    .sendToDevice(deviceId, { notification, data: omit(payload, ['title', 'body']) })
    .then((result) => callback(null, result))
    .catch((error) => callback(error, null));
}