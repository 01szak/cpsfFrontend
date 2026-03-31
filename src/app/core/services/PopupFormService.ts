import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReservationFormComponent, ReservationFormData } from '@shared/form/reservation-form.component';
import { GuestFormComponent, GuestFormData } from '@shared/form/guest-form.component';

@Injectable({ providedIn: 'root' })
export class PopupFormService {
  private readonly popupForm = inject(MatDialog);

  openReservationFormPopup(reservationFd?: ReservationFormData) {
    return this.popupForm.open(ReservationFormComponent, {
      data: reservationFd,
      panelClass: 'popupForm',
      width: 'auto',
      maxWidth: '600px'
    });
  }

  openGuestFormPopup(guestFd?: GuestFormData) {
    return this.popupForm.open(GuestFormComponent, {
      data: guestFd,
      panelClass: 'popupForm',
      width: 'auto',
      maxWidth: '500px'
    });
  }
}
