import {Reservation} from './Reservation';

export interface CamperPlace {
  number?: number;
  type: string;
  price: string;
  reservations: Array<Reservation>;

}


