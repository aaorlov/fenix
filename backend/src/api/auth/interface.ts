import Parent from '../parent/interface';
import Doctor from '../doctor/interface';

export default interface Auth {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  position: string;
  role: string;
  address: string;
  deviceId: string;
  parent: Parent;  
  doctor: Doctor;
}