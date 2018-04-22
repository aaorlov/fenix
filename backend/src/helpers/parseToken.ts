import { last } from 'lodash';
import { getToken } from '../utils';
import { Request } from '../interfaces';
import Auth from '../api/auth/model';

export default function(req: Request) {
  const token = getToken(req);

  if (token) {
    return last(token.split(Auth.headerPrefix));
  }

  return false;
}