import {Guest} from './Guest';
import {CamperPlace} from './CamperPlace';

export interface Reservation{
  checkin: Date;
  checkout: Date;
  camperPlace: CamperPlace;
  guest: Guest;
  status: string;
}
