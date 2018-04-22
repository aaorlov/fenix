import User from '../user/interface';

export default interface Parent {
  _id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  doctors: string[];
  user: User | string[];
}