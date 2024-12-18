
export class CamperPlace {
  private camperPlaceNumber: number;
  private price?: number;
  private type?: CamperPlaceType;
  isOccupied: boolean = false;

  constructor(camperPlaceNumber: number, price?: number, type?: CamperPlaceType) {

    this.camperPlaceNumber = camperPlaceNumber;
    this.price = price;
    this.type = type;

  }


  get getCamperPlaceNumber(): number {
    return this.camperPlaceNumber;
  }
}
const enum CamperPlaceType {
  "STANDARD",
  "VIP",
  "PLUS"
}


