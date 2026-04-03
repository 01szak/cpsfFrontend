import {inject, Injectable} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Guest} from '@core/models/Guest';
import {CamperPlaceForTable} from '@core/models/CamperPlaceForTable';
import {Reservation} from '@core/models/Reservation';
import moment from 'moment';
import {DateFormater} from '@shared/helper/DateFormater';

@Injectable({ providedIn: 'root' })
export class FormFactoryService {
  private readonly formBuilder = inject(FormBuilder);

  buildReservationForm() {
    return this.formBuilder.group({
      checkinDate: new FormControl<moment.Moment | null>(null),
      checkoutDate: new FormControl<moment.Moment | null>(null),
      camperPlace: new FormControl<CamperPlaceForTable | null>(null),
      guestSearch: new FormControl<{ name: string; guest: Guest } | null>(null),
      guest: this.buildGuestForm(),
    });
  }

  buildGuestForm() {
    return this.formBuilder.group({
      id: [''],
      firstname: [''],
      lastname: [''],
      email: [''],
      phoneNumber: [''],
      carRegistration: [''],
    });
  }

  patchReservation(formGroup: FormGroup, reservation: Reservation) {
    const guestName = `${reservation.guest!.firstname} ${reservation.guest!.lastname}`
    formGroup.patchValue({
      checkinDate: DateFormater.MOMENT(reservation.checkin),
      checkoutDate: DateFormater.MOMENT(reservation.checkout),
      camperPlace: {index: reservation.camperPlace.index} as CamperPlaceForTable,
      guestSearch: guestName,
      guest: this.patchGuest(formGroup, reservation.guest!),
    })

    return formGroup;
  }

  patchGuest(formGroup: FormGroup, guest: Guest) {
    const guestGroup = formGroup.get('guest');
    const data = {
      id: guest.id,
      firstname: guest.firstname,
      lastname: guest.lastname,
      email: guest.email,
      phoneNumber: guest.phoneNumber,
      carRegistration: guest.carRegistration,
    };

    if (guestGroup) {
      guestGroup.patchValue(data);

      const fullName = `${guest.firstname} ${guest.lastname}`;
      formGroup.get('guestSearch')?.setValue({ name: fullName, guest: guest });
    } else  {
      formGroup.patchValue(data);
    }

    return formGroup;
  }
}
