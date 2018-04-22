import { Response, Request, NextFunction } from '../../interfaces';
import { response } from '../../utils';

export default function(req: Request, res: Response, next: NextFunction): void {
  const {createdAt} = req.body;

  if (!createdAt) return response(res, 400, null, { message: 'Field \'createdAt\' is required.' });
  if (isNaN(createdAt) || createdAt.toString().length !== 10) return response(res, 400, null, { message: 'Invalid \'createdAt\' field.' });

  next();
}