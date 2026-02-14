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
          { name: 'Imię', field: 'firstname', type: 'text', additional: true },
          { name: 'Nazwisko', field: 'lastname', type: 'text', additional: true },
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
          const guestToCreate = this.getDefaultGuest(result);
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
          { name: 'Gość', field: 'guest', type: 'select', defaultValue: reservationToUpdate.guest ? (reservationToUpdate.guest.firstname + " " + reservationToUpdate.guest.lastname) : '',  replacedByAdditional: true, readonly: true},
          { name: 'Imię', field: 'firstname', type: 'text', additional: true, defaultValue: reservationToUpdate.guest?.firstname },
          { name: 'Nazwisko', field: 'lastname', type: 'text', additional: true, defaultValue: reservationToUpdate.guest?.lastname },
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
        dialogRef.componentInstance.secondAction = () => {
          const result = dialogRef.componentInstance.formValues;
          reservationToUpdate.checkin = result['checkin']?.toString() ?? reservationToUpdate.checkin;
          reservationToUpdate.checkout = result['checkout']?.toString() ?? reservationToUpdate.checkout;
          reservationToUpdate.camperPlaceIndex = result['camperPlaceIndex']?.toString() ?? reservationToUpdate.camperPlaceIndex;
          reservationToUpdate.paid = result['paid'] ?? reservationToUpdate.paid;
          reservationToUpdate.guest!.firstname = result['firstname']?.toString() ?? reservationToUpdate.guest?.firstname;
          reservationToUpdate.guest!.lastname = result['lastname']?.toString() ?? reservationToUpdate.guest?.lastname;
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
          { name: 'Imie', field: 'firstname', type: 'text'},
          { name: 'Nazwisko', field: 'lastname', type: 'text'},
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
          const guestToCreate: Guest = this.getDefaultGuest(result);

          this.popupConfirmationService.openConfirmationPopup(
            "Gość zostanie dodany. Czy chcesz kontynuować?",
            () => this.userService.create(guestToCreate).subscribe()
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
        firstname: guest.firstname,
        lastname: guest.lastname,
        email: guest.email,
        phoneNumber: guest.phoneNumber,
        carRegistration: guest.carRegistration
      };
      const formData: FormData = {
        header: 'Edycja Gościa',
        update: true,
        objectToUpdate: userToUpdate,
        formInputs: [
          { name: 'Imie', field: 'firstname', type: 'text', defaultValue: guest.firstname},
          { name: 'Nazwisko', field: 'lastname', type: 'text', defaultValue: guest.lastname},
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
          userToUpdate.firstname = result['firstname']?.toString() ?? userToUpdate.firstname;
          userToUpdate.lastname = result['lastname']?.toString() ?? userToUpdate.lastname;
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

    private getDefaultGuest(result: Record<string, any>): Guest {
      return {
        id: '',
        firstname: result['firstname']?.toString() ?? '',
        lastname: result['lastname']?.toString() ?? '',
        carRegistration: result['carRegistration']?.toString() ?? '',
        email: result['email']?.toString() ?? '',
        phoneNumber: result['phoneNumber']?.toString() ?? '',
      }
    }

  }
