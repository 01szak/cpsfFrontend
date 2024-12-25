import {CamperPlace} from './CamperPlace';
import {User} from './User';


export class Reservation {
  private id: number;
  private checkin: Date;
  private checkout: Date;
  private camperPlace: CamperPlace;
  private user: User;
  private reservationStatus: ReservationStatus;


  constructor(id: number, checkin: Date, checkout: Date, camperPlace: CamperPlace, user: User, reservationStatus: ReservationStatus) {
    this.id = id;
    this.checkin = checkin;
    this.checkout = checkout;
    this.camperPlace = camperPlace;
    this.user = user;
    this.reservationStatus = reservationStatus;
  }
}
enum ReservationStatus {

  EXPIRED,ACTIVE,COMING
}
