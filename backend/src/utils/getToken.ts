import { Request } from '../interfaces';

export default function(req: Request): string {
  return req.body.token || req.query.token || req.headers['authorization'];
}