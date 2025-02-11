import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CamperPlacePopupComponent } from '../components/admin/popups/camperPlacePopup/camperPlacePopup.component';
import {
  ReservationPopupComponent
} from '../components/admin/popups/reservationPopup/reservation-create-popup/reservation-popup.component';
import {
  ReservationUpdatePopupComponent
} from '../components/admin/popups/reservationPopup/reservation-update-popup/reservation-update-popup.component';
import {Reservation} from '../components/admin/calendar/Reservation';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private dialog: MatDialog) {}

  openCamperPlacePopup() {
    this.dialog.open(CamperPlacePopupComponent);
  }

  openCreateReservationPopup() {
    this.dialog.open(ReservationPopupComponent);
  }
  closePopup() {
    this.dialog.closeAll()
  }

  openUpdateReservationPopup(reservation: Reservation) {
    this.dialog.open(ReservationUpdatePopupComponent,{
      data: reservation
    })
  }
}
