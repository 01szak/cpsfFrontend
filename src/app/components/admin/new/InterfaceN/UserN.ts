import {BackendEntity} from './BackendEntity';

export interface UserN extends BackendEntity {
  __type?: 'UserN';
  id: number,
  firstName: string,
  lastName: string,
  email: string;
  phoneNumber: string;
  carRegistration: string,
}
