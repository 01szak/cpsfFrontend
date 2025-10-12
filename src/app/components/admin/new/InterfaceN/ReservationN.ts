import {UserN} from './UserN';
import {BackendEntity} from './BackendEntity';

export  interface ReservationN extends BackendEntity{
  __type?: 'ReservationN';
  id?: number
  checkin: string;
  checkout: string;
  user?: UserN;
  stringUser?: string;
  camperPlaceIndex: string;
  price?: number;
  reservationStatus?: string;
  paid: boolean;

 }
