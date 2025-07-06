import {Reservation} from './Reservation';

export interface CamperPlace {
  id?: number
  index?: string;
  type: string;
  price: string;
  reservations: Array<Reservation>;

}


