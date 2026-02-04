import {Guest} from './Guest';
import {BackendEntity} from './BackendEntity';

export  interface Reservation extends BackendEntity{
  __type?: 'Reservation';
  id?: number
  checkin: string;
  checkout: string;
  guest?: Guest;
  stringUser?: string;
  camperPlaceIndex: string;
  price?: number;
  reservationStatus?: string;
  paid: boolean;
 }
