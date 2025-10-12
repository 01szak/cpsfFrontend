import {BackendEntity} from './BackendEntity';

export interface User extends BackendEntity {
  __type?: 'User';
  id: number,
  firstName: string,
  lastName: string,
  email: string;
  phoneNumber: string;
  carRegistration: string,
}
