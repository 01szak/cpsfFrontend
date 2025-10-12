import {User} from './User';
import {BackendEntity} from './BackendEntity';

export  interface Reservation extends BackendEntity{
  __type?: 'Reservation';
  id?: number
  checkin: string;
  checkout: string;
  user?: User;
  stringUser?: string;
  camperPlaceIndex: string;
  price?: number;
  reservationStatus?: string;
  paid: boolean;

 }
