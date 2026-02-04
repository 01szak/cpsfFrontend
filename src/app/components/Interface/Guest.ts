import {BackendEntity} from './BackendEntity';

export interface Guest extends BackendEntity {
  __type?: 'Guest';
  id: number,
  firstName: string,
  lastName: string,
  email: string;
  phoneNumber: string;
  carRegistration: string,
}
