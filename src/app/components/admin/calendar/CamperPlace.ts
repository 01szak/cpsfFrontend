
export class CamperPlace {
  camperPlaceNumber?: number;
  price?: number;
  type?: CamperPlaceType;
  isOccupied: boolean = false;

  constructor(camperPlaceNumber?: number, price?: number, type?: CamperPlaceType) {

    this.camperPlaceNumber = camperPlaceNumber;
    this.price = price;
    this.type = type;

  }


}
const enum CamperPlaceType {
  "STANDARD",
  "VIP",
  "PLUS"
}


