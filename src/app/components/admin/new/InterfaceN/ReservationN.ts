import {UserN} from './UserN';
import {BackendEntities} from './BackendEntities';

export  interface ReservationN extends BackendEntities{
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
