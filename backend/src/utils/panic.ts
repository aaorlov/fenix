import { Response } from '../interfaces';
import response from './response';

export default function(res: Response, err: any, code?: number): void {
  response(res, code || 500, null, err.errors || err);
}