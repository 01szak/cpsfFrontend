import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CamperPlacePopupComponent } from '../components/admin/popups/camperPlacePopup/camperPlacePopup.component';
import {
  ReservationPopupComponent
} from '../components/admin/popups/reservationPopup/reservation-popup/reservation-popup/reservation-popup.component';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private dialog: MatDialog) {}

  openCamperPlacePopup() {
    this.dialog.open(CamperPlacePopupComponent);
  }

  openReservationPopup() {
    this.dialog.open(ReservationPopupComponent);
  }
  closePopup() {
    this.dialog.closeAll()
  }
}
