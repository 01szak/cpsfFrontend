import {Reservation} from './Reservation';
import {InputSignal} from '@angular/core';

export class CamperPlace {
  private id: number = 0;
  private isOccupied: boolean = false;
  private type: string;
  private price: number;
  private reservations: Array<Reservation>;


  constructor(type: string, price: number, reservations: Array<Reservation>) {
    this.type = type;
    this.price = price;
    this.reservations = reservations;
  }


}
