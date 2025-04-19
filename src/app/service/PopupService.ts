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
import {User} from '../components/admin/calendar/User';
import {
  UserUpdatePopupComponent
} from '../components/admin/popups/userPopup/user-update-popup/user-update-popup.component';
import {CamperPlace} from '../components/admin/calendar/CamperPlace';

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
    openCreateReservationPopupFromCalendar(date: Date, camperPlace: CamperPlace) {
    this.dialog.open(ReservationPopupComponent,{
      data:{
        checkinDate: date,
        camperPlaceNumber: camperPlace.index
      }

      });
  }

  closePopup() {
    this.dialog.closeAll()
  }

  openUpdateReservationPopup(reservation: Reservation,camperPlace: CamperPlace) {
    this.dialog.open(ReservationUpdatePopupComponent,{
      data:{
        reservation: reservation,
        camperPlace: camperPlace
      }
    })
  }

  openUpdateUserPopup(user: User) {
    this.dialog.open(UserUpdatePopupComponent,{
      data: user
    })

  }
}
