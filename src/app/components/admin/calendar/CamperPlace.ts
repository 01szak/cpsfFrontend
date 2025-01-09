import {Reservation} from './Reservation';
import {InputSignal} from '@angular/core';

export class CamperPlace {

  private _id: number = 0;
  private _isOccupied: boolean = false;
  private _type: string;
  private _price: number;
  private _reservations: Array<Reservation>;


  constructor(type: string, price: number, reservations: Array<Reservation>) {
    this._type = type;
    this._price = price;
    this._reservations = reservations;
  }


  get reservations(): Array<Reservation> {
    return this._reservations;
  }
  set reservations(value: Array<Reservation>) {
    this._reservations = value;
  }
}
 export interface CamperPlaceToJSONParser{
  type: string;
  price: number;
}
