import {Component, Inject} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
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
import {HttpErrorResponse} from '@angular/common/http';

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
    MatLabel,
    MatHint
  ],
  templateUrl: './reservation-update-popup.component.html',
  standalone: true,
  styleUrl: './reservation-update-popup.component.css'
})
export class ReservationUpdatePopupComponent {
  camperPlace!: CamperPlace;
  camperPlaces: CamperPlace[] = [];
  errorMessage: string = ''

updatedReservation!: {
  camperPlaceIndex: string;
  checkin: Date;
  userLastName: string;
  paid: any;
  userEmail: string;
  id: number;
  userFirstName: string;
  checkout: Date;
  reservationStatus: string
};
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) protected data: { reservation:Reservation,camperPlace:CamperPlace }, private camperPlaceService: CamperPlaceService, private reservationService: ReservationService) {
  }

  ngOnInit() {
    this.updatedReservation = {
      camperPlaceIndex: this.data.camperPlace.index || this.data.reservation.camperPlaceIndex,
      checkin: this.data.reservation.checkin,
      checkout: this.data.reservation.checkout,
      id: this.data.reservation.id,
      reservationStatus: '',
      userEmail: this.data.reservation.userEmail,
      userFirstName: this.data.reservation.userFirstName,
      userLastName:this.data.reservation.userLastName,
      paid: this.data.reservation.paid

    };
    this.findCamperPlaceByIndex(this.updatedReservation.camperPlaceIndex);
    console.log(this.camperPlace)


    this.loadCamperPlace()
    console.log(this.data.reservation)
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

  inedx: string =   '';

  findCamperPlaceByIndex(index: string): CamperPlace {

    this.camperPlaceService.findCamperPlaceByIndex(index).subscribe({
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
      id: this.updatedReservation.id,
      checkin: new Date(this.updatedReservation.checkin ).toISOString().split('T')[0], // YYYY-MM-DD
      checkout: new Date(this.updatedReservation.checkout ).toISOString().split('T')[0],
      camperPlace: this.camperPlace ,
      paid: this.data.reservation.paid
    }
    this.reservationService.updateReservation(reservationRequest).subscribe({
      next: () => {
        window.location.reload();
        this.closePopup();
      },error:(err: HttpErrorResponse)=>{
        this.errorMessage = err.error || 'Unknown Error...'
        console.log(reservationRequest)
        console.log(err)

      }
    })
  }
  deleteReservation(id: number){
    this.reservationService.deleteReservation(id).subscribe({
        next:() =>{
          window.location.reload()
        },
      error:(err) =>{
          console.log(err)
    }
      }
    );
  }
}
