import {User} from './User';
import {CamperPlace} from './CamperPlace';

export interface Reservation{
  id: number;
  checkin: Date;
  checkout: Date;
  status: string;
  camperPlaceNumber: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
}
