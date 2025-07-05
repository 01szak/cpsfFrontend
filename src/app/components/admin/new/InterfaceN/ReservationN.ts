import {UserN} from './UserN';

export  interface ReservationN {
  id?: number
  checkin: string;
  checkout: string;
  user: UserN
  camperPlaceIndex: string;
  price: number;
  isPaid: boolean;
 }
