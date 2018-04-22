import { Model } from '../../base';
import Schema from './schema';

class Patient extends Model {}

export default new Patient('Patient', Schema, null);