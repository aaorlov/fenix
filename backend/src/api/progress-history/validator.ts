import { Response, Request, NextFunction } from '../../interfaces';
import { response } from '../../utils';
import { HEIGHT, WEIGHT } from './schema';

export default function(req: Request, res: Response, next: NextFunction): void {
  const {createdAt} = req.body;

  if (req.body.hasOwnProperty(HEIGHT) && req.body.hasOwnProperty(WEIGHT)) {
    return response(res, 400, null, { message: 'Only one of the fields \'height\' or \'weight\' you can send.' });
  }

  if (!req.body.weight && !req.body.height) {
    return response(res, 400, null, { message: 'One of the fields \'height\' or \'weight\' is required.' });
  }

  if (!createdAt) return response(res, 400, null, { message: 'Field \'createdAt\' is required.' });
  if (isNaN(createdAt) || createdAt.toString().length !== 10) return response(res, 400, null, { message: 'Invalid \'createdAt\' field.' });

  next();
}