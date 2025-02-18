import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAnchor, MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {PopupService} from '../../../../../service/PopupService';
import {ReservationService} from '../../../../../service/ReservationService';
import {MatDatepickerModule} from '@angular/material/datepicker';
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
import {UserService} from '../../../../../service/UserService';

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
    ReservationUpdatePopupComponent,
    AsyncPipe
  ],
  templateUrl: './reservation-popup.component.html',
  standalone: true,
  styleUrl: './reservation-popup.component.css'
})
export class ReservationPopupComponent {
  camperPlaces: Array<CamperPlace> = [];
  checkin!: string;
  number!: number;
  allUsers!: User[];
  searchValue = '';
  searchForm!: FormGroup;


  constructor(
    private camperPlaceService: CamperPlaceService,
    private dialog: MatDialog,
    private popupService: PopupService,
    private reservationService: ReservationService,
    @Inject(MAT_DIALOG_DATA) public data: { camperPlaceNumber: number; checkinDate: Date },
    private userService: UserService,
    private fb: FormBuilder
  ) { this.searchForm = this.fb.nonNullable.group({
    searchValue: '',
  })
}
  camperPlace: CamperPlace = {
    reservations: [],
    number: 0,
    price: '',
    type: ''
  }
  reservation: Reservation = {
    camperPlaceNumber: 0,
    checkin: new Date(this.checkin) ?? new Date(),
    userLastName: '',
    userEmail: '',
    id: 0,
    userFirstName: '',
    checkout: new Date(),
    reservationStatus: ''
  }


  user: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    reservations: [],
    carRegistration: '',
    country: '',
    city: '',
    streetAddress: ''
  };

  displayFn(user: User): string {
    return user ? `${user.firstName} ${user.lastName}` : ''
  }

  ngOnInit() {
    this.loadCamperPlace()
    this.checkin = new Date(this.data.checkinDate).toISOString().split('T')[0];
    this.number = this.data.camperPlaceNumber;
    if (this.number !== 0) {
      this.findCamperPlaceByNumber(this.number);
    }
    this.getFilteredUsers();
  }

  onSearchSubmit() {
    this.searchValue = this.searchForm.value.searchValue;
    this.getFilteredUsers();

  }
  getFilteredUsers() {
    this.userService.getFilteredUsers(this.searchValue).subscribe({
      next: (u) => {
        this.allUsers = u;
      }
    })
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

  createReservation() {
    const reservationRequest = {
      checkin: new Date(this.checkin).toISOString().split('T')[0], // YYYY-MM-DD
      checkout: new Date(this.reservation.checkout).toISOString().split('T')[0],
      camperPlace: this.camperPlace,
      user: this.user,
    };

    this.reservationService.createReservation(reservationRequest).subscribe({
      next: () => {
        this.closePopup();
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
        console.log(reservationRequest)
        this.closePopup();

      }
    });
  }


  findCamperPlaceByNumber(number: number): CamperPlace {
    if (number !== 0) {
      this.camperPlaceService.findCamperPlaceByNumber(number).subscribe({
        next: (cp) => {
          this.camperPlace = cp;
          console.log(cp)
        }, error: (err) => {
          console.log(err)
        }

      });
    }
    return this.camperPlace;
  }




  findUserById(user:User) {
    return this.userService.getUserById(user.id).subscribe({
      next:(user) =>{
        this.user = user
        console.log(this.user)
      }
    })
  }
}
