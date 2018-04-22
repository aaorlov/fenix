import parser = require('ua-parser-js');
import { Request } from '../interfaces';

export default function(req: Request): void {
  return parser(req.headers['user-agent']);
}