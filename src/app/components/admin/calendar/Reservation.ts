export interface Reservation {
  id: number;
  checkin: Date;
  checkout: Date;
  reservationStatus: string;
  camperPlaceIndex: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  paid: boolean
}
