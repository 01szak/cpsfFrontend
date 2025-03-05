export interface Reservation {
  id: number;
  checkin: Date;
  checkout: Date;
  reservationStatus: string;
  camperPlaceNumber: number;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  paid: boolean
}
