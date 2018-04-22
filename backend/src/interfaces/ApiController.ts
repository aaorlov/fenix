import Model from './Model';
import Request from './Request';
import Response from './Response';

export default interface ApiController {
  model: Model;
  
  index(req: Request, res: Response): void;
  show(req: Request, res: Response): void;
  create(req: Request, res: Response): void;
  patch(req: Request, res: Response): void;
  update(req: Request, res: Response): void;
  destroy(req: Request, res: Response): void;
  limit(req: Request, res: Response): void;
}