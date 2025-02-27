import {Reservation} from './Reservation';

export interface CamperPlace {
  id?: number
  number?: number;
  type: string;
  price: string;
  reservations: Array<Reservation>;

}


