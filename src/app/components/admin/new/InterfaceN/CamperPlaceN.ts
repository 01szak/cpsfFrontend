import {ReservationN} from './ReservationN';

export interface CamperPlaceN {
  id: number
  index: string;
  reservations: ReservationN[]
}
