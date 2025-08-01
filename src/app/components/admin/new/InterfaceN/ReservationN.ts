import {UserN} from './UserN';

export  interface ReservationN {
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
