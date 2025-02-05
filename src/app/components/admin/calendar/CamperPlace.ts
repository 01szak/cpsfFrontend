import {Reservation} from './Reservation';
import {InputSignal} from '@angular/core';

export interface CamperPlace {
  number?: number;
  type: string;
  price: string;
  reservations: Array<Reservation>;

}


