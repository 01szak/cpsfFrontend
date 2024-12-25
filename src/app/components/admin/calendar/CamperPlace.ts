import {Reservation} from './Reservation';

export class CamperPlace {
  private id: number;
  private isOccupied: boolean = false;
  private type: CamperPlaceType;
  private price: number;
  private reservations?: Array<Reservation>;


  constructor(id: number, isOccupied: boolean, type: CamperPlaceType, price: number, reservations?: Array<Reservation>) {
    this.id = id;
    this.isOccupied = isOccupied;
    this.type = type;
    this.price = price;
    this.reservations = reservations;
  }
  get getId(): string{
    return this.id.toString();
  }

}
const enum CamperPlaceType {
  "STANDARD",
  "VIP",
  "PLUS"
}


