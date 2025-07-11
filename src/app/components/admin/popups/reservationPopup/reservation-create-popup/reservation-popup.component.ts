import {Component, inject, Inject, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAnchor, MatButton, MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle
} from '@angular/material/dialog';
import {AsyncPipe, CommonModule, NgForOf, NgIf} from '@angular/common';
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
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CalendarComponent} from '../../../calendar/calendar.component';
import {ConfirmationComponent, ConfirmationService} from '../../confirmation/confirmation.component';

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
    AsyncPipe,
    MatDialogModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './reservation-popup.component.html',
  standalone: true,
  styleUrl: './reservation-popup.component.css'
})
export class ReservationPopupComponent {
  camperPlaces: Array<CamperPlace> = [];
  checkin!: string;
  index!: string;
  allUsers!: User[];
  searchValue = '';
  searchForm!: FormGroup;
  errorMessage: string = '';
  isNewGuestClicked: boolean = false;
  tempUser!: User;

  constructor(
    private camperPlaceService: CamperPlaceService,
    private dialog: MatDialog,
    protected popupService: PopupService,
    private reservationService: ReservationService,
    @Inject(MAT_DIALOG_DATA) private data: { camperPlace: CamperPlace; checkinDate: Date },
    private userService: UserService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) {
    this.searchForm = this.fb.nonNullable.group({
      searchValue: '',
    })
  }

  camperPlace: CamperPlace = this.data?.camperPlace ??  {
    reservations: [],
    index: "",
    price: '',
    type: ''
  }
  reservation: Reservation = {
    camperPlaceIndex: "",
    checkin: new Date(this.checkin) ?? new Date(),
    userLastName: '',
    userEmail: '',
    id: 0,
    userFirstName: '',
    checkout: new Date(),
    reservationStatus: '',
    paid: false
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

    this.getFilteredUsers()
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
    this.confirmationService.performAction('Create').subscribe(confirmed => {
      if (confirmed) {
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
          error: (err: HttpErrorResponse) => {
            console.log(err)
            this.errorMessage = err.error || 'Unexpected error...'

          }
        });
      }
    })

  }

  newGuestCheckBox() {
    if (this.isNewGuestClicked) {
      this.user = {
        carRegistration: "",
        city: "",
        country: "",
        email: "",
        firstName: "",
        id: 0,
        lastName: "",
        phoneNumber: "",
        reservations: [],
        streetAddress: ""

      }

    } else {
      this.user = this.tempUser;


    }
  }





  findUserById(user: User) {
    return this.userService.getUserById(user.id).subscribe({
      next: (user) => {
        this.user = user
        this.tempUser = user;
        console.log(this.tempUser)
      }
    })
  }

  resetUserData() {
    this.user = {
      carRegistration: '',
      city: '',
      country: '',
      email: '',
      firstName: '',
      id: 0,
      lastName: '',
      phoneNumber: '',
      reservations: [],
      streetAddress: ''

    }
  }
}
