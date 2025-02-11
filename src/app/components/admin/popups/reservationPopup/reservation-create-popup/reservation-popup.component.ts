import {Component} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {NgForOf, NgIf} from '@angular/common';
import {PopupService} from '../../../../../service/PopupService';
import {ReservationService} from '../../../../../service/ReservationService';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatNativeDateModule, MatOption} from '@angular/material/core';
import {User} from '../../../calendar/User';
import {CamperPlace} from '../../../calendar/CamperPlace';
import {CamperPlaceService} from '../../../../../service/CamperPlaceService';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {Reservation} from '../../../calendar/Reservation';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatSelect} from '@angular/material/select';
import {MatRadioButton} from '@angular/material/radio';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatCheckbox} from '@angular/material/checkbox';
import {ReservationUpdatePopupComponent} from '../reservation-update-popup/reservation-update-popup.component';

@Component({
  selector: 'app-reservation-popup',
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    NgForOf,
    MatAnchor,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatSuffix,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelect,
    MatOption,
    MatRadioButton,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatCheckbox,
    NgIf,
    ReactiveFormsModule,
    ReservationUpdatePopupComponent
  ],
  templateUrl: './reservation-popup.component.html',
  standalone: true,
  styleUrl: './reservation-popup.component.css'
})
export class ReservationPopupComponent {
  camperPlaces: Array<CamperPlace> = [];
  checkinControl = new FormControl;

  constructor(private camperPlaceService: CamperPlaceService, private dialog: MatDialog, private popupService: PopupService, private reservationService: ReservationService) {
  }



  camperPlace: CamperPlace = {
    number: 0,
    price: '',
    reservations: [],
    type: ''

  };
  reservation: Reservation = {
    id: 0,
    checkin: new Date(),
    checkout: new Date(),
    reservationStatus: '',
    camperPlaceNumber: 0,
    userEmail: '',
    userFirstName: '',
    userLastName: ''

  };

  user: User = {
    firstName:  '',
    lastName: '',
    email: '',
    phoneNumber: '',
    reservations: [],
    carRegistration: '',
    country: '',
    city: '',
    streetAddress: '',
  };
  ngOnInit() {
    this.loadCamperPlace()
  }

  loadCamperPlace() {
    this.camperPlaceService.getAllCamperPlaces().subscribe({
      next: (cp) => {
        this.camperPlaces = cp;
      }
    })

  }

  closePopup() {
    this.dialog.closeAll();
  }

  createReservation(reservation: Reservation) {
    const reservationRequest = {
      checkin: new Date(this.reservation.checkin).toISOString().split('T')[0], // YYYY-MM-DD
      checkout: new Date(this.reservation.checkout).toISOString().split('T')[0],
      camperPlace: this.camperPlace,
      user: this.user,
    }
    this.reservationService.createReservation(reservationRequest).subscribe({
      next:()=>{
        this.closePopup();
        window.location.reload();
      },
      error:(err)=>{
        console.log(err);
        console.log(reservationRequest)
        this.closePopup();

      }
    });
}

  number: number = 0;

  findCamperPlaceByNumber(number: number): CamperPlace {
    this.camperPlaceService.findCamperPlaceByNumber(number).subscribe({
      next: (cp) => {
          this.camperPlace = cp;
          console.log(cp)
      },error: (err)=>{
        console.log(err)
      }

    });
    return this.camperPlace;
  }
}
