import { Model } from '../../interfaces';

export default interface User extends Model {
  _id?: string;
  email: string;
  password: string;
}