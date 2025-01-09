import {CamperPlace} from './CamperPlace';
import {User} from './User';
import  moment from 'moment';

export class Reservation {
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get checkin(): Date {
    return this._checkin;
  }

  set checkin(value: Date) {
    this._checkin = value;
  }

  get checkout(): Date {
    return this._checkout;
  }

  set checkout(value: Date) {
    this._checkout = value;
  }

  get camperPlace(): CamperPlace {
    return this._camperPlace;
  }

  set camperPlace(value: CamperPlace) {
    this._camperPlace = value;
  }
  private _id: number;
  private _checkin: Date;
  private _checkout: Date;
  private _camperPlace: CamperPlace;

  constructor(id: number, checkin: Date, checkout: Date, camperPlace: CamperPlace) {
    this._id = id;
    this._checkin = checkin;
    this._checkout = checkout;
    this._camperPlace = camperPlace;
  }

  daysBetweenCheckinAndCheckout(): number[] {
    const startDate = moment(this._checkin);
    const endDate= moment(this._checkout);
    const days: number[] = [];
    while (startDate.isBefore(endDate)) {
      days.push(startDate.date());
      startDate.add(1, 'day');
    }
    return days;


  }

}

enum ReservationStatus {

  EXPIRED, ACTIVE, COMING
}
