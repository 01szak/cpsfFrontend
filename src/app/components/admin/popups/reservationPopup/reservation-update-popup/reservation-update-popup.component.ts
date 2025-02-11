import {Component, Inject} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {Reservation} from '../../../calendar/Reservation';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {CamperPlaceService} from '../../../../../service/CamperPlaceService';
import {CamperPlace} from '../../../calendar/CamperPlace';
import {ReservationService} from '../../../../../service/ReservationService';

@Component({
  selector: 'app-reservation-update-popup',
  imports: [
    MatCard,
    MatCardContent,
    MatFormField,
    MatSelect,
    MatOption,
    FormsModule,
    MatInput,
    NgForOf,
    MatButton,
    MatLabel
  ],
  templateUrl: './reservation-update-popup.component.html',
  standalone: true,
  styleUrl: './reservation-update-popup.component.css'
})
export class ReservationUpdatePopupComponent {
  camperPlace!: CamperPlace;
  camperPlaces: CamperPlace[] = [];

updatedReservation!: Reservation;
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) protected reservation: Reservation, private camperPlaceService: CamperPlaceService, private reservationService: ReservationService) {
  }

  ngOnInit() {
    this.updatedReservation = {
      camperPlaceNumber: 0,
      checkin: this.reservation.checkin,
      checkout: this.reservation.checkout,
      id: 0,
      reservationStatus: '',
      userEmail: '',
      userFirstName: '',
      userLastName: ''

    };


    this.loadCamperPlace()
    console.log(this.reservation)
  }

  closePopup() {
    this.dialog.closeAll();
  }


  loadCamperPlace() {
    this.camperPlaceService.getAllCamperPlaces().subscribe({
      next: (cp) => {
        this.camperPlaces = cp;
      }
    })

  }

  number: number = 0;

  findCamperPlaceByNumber(number: number): CamperPlace {

    this.camperPlaceService.findCamperPlaceByNumber(number).subscribe({
      next: (cp) => {
        this.camperPlace = cp;
        console.log(cp)
      }, error: (err) => {
        console.log(err)
      }

    });
    return this.camperPlace;
  }

  updateReservation() {
    const reservationRequest = {
      id: this.reservation.id,
      checkin: new Date(this.updatedReservation.checkin ).toISOString().split('T')[0], // YYYY-MM-DD
      checkout: new Date(this.updatedReservation.checkout ).toISOString().split('T')[0],
      camperPlace: this.camperPlace,
    }
    this.reservationService.updateReservation(reservationRequest).subscribe({
      next: () => {
        window.location.reload();
        this.closePopup();
      },error:()=>{
        console.log(reservationRequest)

      }
    })
  }
}
