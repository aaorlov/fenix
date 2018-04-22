import Parent from '../parent/interface';

export default interface Patient {
  _id?: string;
  firstName: string;
  lastName: string;
  parent: Parent;
}