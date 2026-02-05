  import {inject, Injectable} from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
  import {map, Observable} from 'rxjs';
  import {ReservationService} from './ReservationService';
  import {UserService} from './UserService';
  import {PopupConfirmationService} from './PopupConfirmationService';
  import {ReservationHelper} from '../util/ReservationHelper';
  import {CamperPlace} from '../components/Interface/CamperPlace';
  import {Guest} from '../components/Interface/Guest';
  import {Reservation} from '../components/Interface/Reservation';
  import {PopupFormComponent, FormData} from '../components/admin/popups/popup-form/popup-form.component';
  import {CamperPlaceService} from './CamperPlaceService';

  @Injectable({providedIn: "root"})
  export class PopupFormService {
    readonly popupForm: MatDialog = inject(MatDialog);
    guests$: Observable<Guest[]>;
    camperPlaces$: Observable<string[]>;

    constructor(
      private popupConfirmationService: PopupConfirmationService,
      private reservationService: ReservationService,
      private userService: UserService,
      private reservationHelper: ReservationHelper,
      private camperPlaceService: CamperPlaceService
    ) {
      this.guests$ = this.userService.findAll().pipe(map(p=> p.content))

      this.camperPlaces$ = this.camperPlaceService.getCamperPlaces().pipe(map(camperPlaces => camperPlaces.map(cp => cp.index)));
    }

    openCreateReservationFormPopup(camperPlace?: CamperPlace, year?: number, month?: number, day?: number) {
      const checkinDefaultDate = (year === undefined || month === undefined || day === undefined) ? undefined : new Date(year, month, day);
      const formData: FormData = {
        header: 'Nowa rezerwacja',
        formInputs: [
          { name: 'Data wjazdu', field: 'checkin', type: 'date', defaultValue: checkinDefaultDate, readonly: checkinDefaultDate instanceof Date, additional: false},
          { name: 'Data wyjazdu', field: 'checkout', type: 'date', additional: false},
          { name: 'Numer parceli', field: 'camperPlaceIndex', type: 'text', select:true, selectList: this.camperPlaces$, defaultValue: camperPlace?.index || undefined, readonly: (camperPlace?.index.length || 0) > 0, additional: false},
          { name: 'Gość', field: 'guest', type: 'text', select: true, selectList: this.guests$, additional: false, replacedByAdditional: true, autocomplete: true},
          { name: 'Imię', field: 'firstName', type: 'text', additional: true },
          { name: 'Nazwisko', field: 'lastName', type: 'text', additional: true },
          { name: 'Rejestracja', field: 'carRegistration', type: 'text', additional: true },
          { name: 'Email', field: 'email', type: 'email', additional: true },
          { name: 'Numer Telefonu', field: 'phoneNumber', type: 'text', additional: true },
        ]
      };
      const dialogRef = this.popupForm.open(PopupFormComponent, {
        data: formData,
        panelClass: 'popupForm'
      })
      dialogRef.afterOpened().subscribe(() => {
        dialogRef.componentInstance.secondAction = () => {
          const result = dialogRef.componentInstance.formValues;
          const guestToCreate: Guest = {
            id: '',
            firstName: result['firstName']?.toString() ?? '',
            lastName: result['lastName']?.toString() ?? '',
            carRegistration: result['carRegistration']?.toString() ?? '',
            email: result['email']?.toString() ?? '',
            phoneNumber: result['phoneNumber']?.toString() ?? '',
          }
          const reservationToCreate: Reservation = {
            paid: false,
            camperPlaceIndex: result['camperPlaceIndex'].toString() ?? '',
            checkin: result['checkin'].toString() ?? '',
            checkout: result['checkout'].toString() ?? '',
            price: 0,
            guest: result['guest'] === undefined || result['guest'] === '' ? guestToCreate : result['guest']
          }
          this.popupConfirmationService.openConfirmationPopup(
            "Rezerwacja zostanie dodana. Czy chcesz kontynuować?",
            () => this.reservationService.createReservation(reservationToCreate).subscribe()
          );
        }
      })

    }

    openUpdateReservationFormPopup(reservation: Reservation, year?: number, month?: number, day?: number) {
      if (!reservation) {
        return
      }
      let reservationToUpdate: Reservation = {
        id: reservation.id,
        checkin: reservation.checkin,
        checkout: reservation.checkout,
        camperPlaceIndex: reservation.camperPlaceIndex,
        guest: reservation.guest,
        paid: reservation.paid
      };
      if(reservationToUpdate.checkin.includes('.')) {
        reservationToUpdate.checkin = this.reservationHelper.formatToStringDate(reservationToUpdate.checkin);
        reservationToUpdate.checkout = this.reservationHelper.formatToStringDate(reservationToUpdate.checkout);
      }
      const formData: FormData = {
        header: 'Edycja Rezerwacji',
        update: true,
        objectToUpdate: reservationToUpdate,
        formInputs: [
          { name: 'Data wjazdu', field: 'checkin', type: 'date', defaultValue: reservationToUpdate.checkin},
          { name: 'Data wyjazdu', field: 'checkout', type: 'date', defaultValue: reservationToUpdate.checkout},
          { name: 'Numer Parceli', field: 'camperPlaceIndex', type: 'text', select:true, selectList: this.camperPlaces$, defaultValue: reservationToUpdate.camperPlaceIndex},
          { name: 'Zaplacone', field: 'paid', type: 'checkbox', checkbox: true, defaultValue: reservationToUpdate.paid},
          { name: 'Gość', field: 'guest', type: 'select', defaultValue: reservationToUpdate.guest ? (reservationToUpdate.guest.firstName + " " + reservationToUpdate.guest.lastName) : '',  replacedByAdditional: true, readonly: true},
          { name: 'Imię', field: 'firstName', type: 'text', additional: true, defaultValue: reservationToUpdate.guest?.firstName },
          { name: 'Nazwisko', field: 'lastName', type: 'text', additional: true, defaultValue: reservationToUpdate.guest?.lastName },
          { name: 'Rejestracja', field: 'carRegistration', type: 'text', additional: true, defaultValue: reservationToUpdate.guest?.carRegistration },
          { name: 'Email', field: 'email', type: 'email', additional: true, defaultValue: reservationToUpdate.guest?.email },
          { name: 'Numer Telefonu', field: 'phoneNumber', type: 'text', additional: true, defaultValue: reservationToUpdate.guest?.phoneNumber },
        ]
      }
      reservationToUpdate.checkin
      const dialogRef = this.popupForm.open(PopupFormComponent, {
        data: formData,
        panelClass: 'popupForm'
      })
      dialogRef.afterOpened().subscribe(() => {
        console.log(reservationToUpdate)
        dialogRef.componentInstance.secondAction = () => {
          const result = dialogRef.componentInstance.formValues;
          reservationToUpdate.checkin = result['checkin']?.toString() ?? reservationToUpdate.checkin;
          reservationToUpdate.checkout = result['checkout']?.toString() ?? reservationToUpdate.checkout;
          reservationToUpdate.camperPlaceIndex = result['camperPlaceIndex']?.toString() ?? reservationToUpdate.camperPlaceIndex;
          reservationToUpdate.paid = result['paid'] ?? reservationToUpdate.paid;
          reservationToUpdate.guest!.firstName = result['firstName']?.toString() ?? reservationToUpdate.guest?.firstName;
          reservationToUpdate.guest!.lastName = result['lastName']?.toString() ?? reservationToUpdate.guest?.lastName;
          reservationToUpdate.guest!.carRegistration = result['carRegistration']?.toString() ?? reservationToUpdate.guest?.carRegistration;
          reservationToUpdate.guest!.email = result['email']?.toString() ?? reservationToUpdate.guest?.email;
          reservationToUpdate.guest!.phoneNumber = result['phoneNumber']?.toString() ?? reservationToUpdate.guest?.phoneNumber;

          this.popupConfirmationService.openConfirmationPopup(
            "Rezerwacja zostanie edytowana. Czy chcesz kontynuować?",
            () => this.reservationService.updateReservation(reservationToUpdate).subscribe()
          );
        }
      })
    }

    openCreateUserFormPopup() {
      const formData: FormData = {
        header: 'Nowy gość',
        formInputs: [
          { name: 'Imie', field: 'firstName', type: 'text'},
          { name: 'Nazwisko', field: 'lastName', type: 'text'},
          { name: 'Email', field: 'email', type: 'text'},
          { name: 'Numer telefonu', field: 'phoneNumber', type: 'text'},
          { name: 'Rejestracja', field: 'carRegistration', type: 'text'},
        ]
      };
      const dialogRef = this.popupForm.open(PopupFormComponent, {
        data: formData,
        panelClass: 'popupForm'
      })
      dialogRef.afterOpened().subscribe(() => {
        dialogRef.componentInstance.secondAction = () => {
          const result = dialogRef.componentInstance.formValues;
          const userToCreate: Guest = {
            id: 0,
            firstName: result['firstName']?.toString() ?? '',
            lastName: result['lastName']?.toString() ?? '',
            carRegistration: result['carRegistration']?.toString() ?? '',
            email: result['email']?.toString() ?? '',
            phoneNumber: result['phoneNumber']?.toString() ?? '',
          }

          this.popupConfirmationService.openConfirmationPopup(
            "Gość zostanie dodany. Czy chcesz kontynuować?",
            () => this.userService.create(userToCreate).subscribe()
          );
        }
      })

    }

    openUpdateUserPopup(guest: Guest) {
      if (!guest) {
        return
      }
      let userToUpdate: Guest = {
        id: guest.id,
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phoneNumber: guest.phoneNumber,
        carRegistration: guest.carRegistration
      };
      const formData: FormData = {
        header: 'Edycja Gościa',
        update: true,
        objectToUpdate: userToUpdate,
        formInputs: [
          { name: 'Imie', field: 'firstName', type: 'text', defaultValue: guest.firstName},
          { name: 'Nazwisko', field: 'lastName', type: 'text', defaultValue: guest.lastName},
          { name: 'Email', field: 'email', type: 'text',defaultValue: guest.email},
          { name: 'Numer telefonu', field: 'phoneNumber', type: 'text', defaultValue: guest.phoneNumber},
          { name: 'Rejestracja', field: 'carRegistration', type: 'text', defaultValue: guest.carRegistration},
        ]
      }
      const dialogRef = this.popupForm.open(PopupFormComponent, {
        data: formData,
        panelClass: 'popupForm'
      })
      dialogRef.afterOpened().subscribe(() => {

        dialogRef.componentInstance.secondAction = () => {
          const result = dialogRef.componentInstance.formValues;
          userToUpdate.firstName = result['firstName']?.toString() ?? userToUpdate.firstName;
          userToUpdate.lastName = result['lastName']?.toString() ?? userToUpdate.lastName;
          userToUpdate.carRegistration = result['carRegistration']?.toString() ?? userToUpdate.carRegistration;
          userToUpdate.email = result['email']?.toString() ?? userToUpdate.email;
          userToUpdate.phoneNumber = result['phoneNumber']?.toString() ?? userToUpdate.phoneNumber;

          this.popupConfirmationService.openConfirmationPopup(
            "Gość zostanie edytowany. Czy chcesz kontynuować?",
            () => this.userService.update(userToUpdate).subscribe()
          );
        }
       }
      );
    }
  }
