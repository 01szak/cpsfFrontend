import {Guest} from './Guest';

export interface Reservation{
  checkin: Date;
  checkout: Date;
  guest: Guest;
  status: string;
}
