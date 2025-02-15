import {Reservation} from './Reservation';

export interface User {
  id: number;
  firstName:string;
  lastName: string;
  email: string;
  phoneNumber: string;
  reservations: Array<Reservation>;
  carRegistration?: string;
  country: string;
  city: string;
  streetAddress?: string;

}
