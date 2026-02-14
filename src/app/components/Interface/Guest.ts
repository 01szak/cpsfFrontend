import {BackendEntity} from './BackendEntity';

export interface Guest extends BackendEntity {
  __type?: 'Guest';
  id: number | string,
  firstname: string,
  lastname: string,
  email: string;
  phoneNumber: string;
  carRegistration: string,
}
