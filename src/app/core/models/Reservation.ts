import {Guest} from './Guest';
import {BackendEntity} from './BackendEntity';
import {CamperPlaceForTable} from '@core/models/CamperPlaceForTable';

export  interface Reservation extends BackendEntity{
  __type?: 'Reservation';
  id?: number
  checkin: string;
  checkout: string;
  guest?: Guest;
  stringUser?: string;
  camperPlace: CamperPlaceForTable;
  camperPlaceIndex?: string;
  price?: number;
  reservationStatus?: string;
  paid: boolean;
 }
