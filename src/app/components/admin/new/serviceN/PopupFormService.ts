import {inject, Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {map, Observable} from 'rxjs';
import {NewReservationService} from '../serviceN/NewReservationService';
import {NewUserService} from '../serviceN/NewUserService';
import {PopupConfirmationService} from '../serviceN/PopupConfirmationService';
import {ReservationHelper} from '../serviceN/ReservationHelper';
import {CamperPlaceN} from './../InterfaceN/CamperPlaceN';
import {UserN} from './../InterfaceN/UserN';
import {ReservationN} from './../InterfaceN/ReservationN';
import {PopupFormComponent, FormData} from './../popup-form/popup-form.component';
import {NewCamperPlaceService} from './NewCamperPlaceService';

@Injectable({providedIn: "root"})
export class PopupFormService {
  readonly popupForm: MatDialog = inject(MatDialog);
  users$: Observable<UserN[]>;
  camperPlaces$: Observable<string[]>;
  constructor(
    private popupConfirmationService: PopupConfirmationService,
    private reservationService: NewReservationService,
    private userService: NewUserService,
    private reservationHelper: ReservationHelper,
    private camperPlaceService: NewCamperPlaceService
  ) {
    this.users$ = this.userService.findAll().pipe(map(p=> p.content))

    this.camperPlaces$ = this.camperPlaceService.getCamperPlaces().pipe(map(camperPlaces => camperPlaces.map(cp => cp.index)));
  }
  openCreateReservationFormPopup(camperPlace?: CamperPlaceN, year?: number, month?: number, day?: number) {
    const checkinDefaultDate = (year === undefined || month === undefined || day === undefined) ? undefined : new Date(year, month, day);
    const formData: FormData = {
      header: 'Nowa rezerwacja',
      formInputs: [
        { name: 'Data wjazdu', field: 'checkin', type: 'date', defaultValue: checkinDefaultDate, readonly: checkinDefaultDate instanceof Date, additional: false},
        { name: 'Data wyjazdu', field: 'checkout', type: 'date', additional: false},
        { name: 'Numer parceli', field: 'camperPlaceIndex', type: 'text', select:true, selectList: this.camperPlaces$, defaultValue: camperPlace?.index || undefined, readonly: (camperPlace?.index.length || 0) > 0, additional: false},
        { name: 'Gość', field: 'user', type: 'text', select: true, selectList: this.users$, additional: false, replacedByAdditional: true, autocomplete: true},
        { name: 'Imię', field: 'firstName', type: 'text', additional: true },
        { name: 'Nazwisko', field: 'lastName', type: 'text', additional: true },
        { name: 'Rejestracja', field: 'carRegistration', type: 'text', additional: true },
        { name: 'Email', field: 'email', type: 'email', additional: true },
        { name: 'Numer Telefonu', field: 'phoneNumber', type: 'text', additional: true },
      ]
    };
    const dialogRef = this.popupForm.open(PopupFormComponent, {
      data: formData
    })
    dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance.secondAction = () => {
        const result = dialogRef.componentInstance.formValues;
        this.popupConfirmationService.openConfirmationPopup(
          "Rezerwacja zostanie dodana. Czy chcesz kontynuować?",

          () => {
            const userToCreate: UserN = {
              id: 0,
              firstName: result['firstName']?.toString() ?? '',
              lastName: result['lastName']?.toString() ?? '',
              carRegistration: result['carRegistration']?.toString() ?? '',
              email: result['email']?.toString() ?? '',
              phoneNumber: result['phoneNumber']?.toString() ?? '',
            }
            const reservationToCreate: ReservationN = {
              paid: false,
              camperPlaceIndex: result['camperPlaceIndex'].toString() ?? '',
              checkin: result['checkin'].toString() ?? '',
              checkout: result['checkout'].toString() ?? '',
              price: 0,
              user: result['user'] === undefined ? userToCreate : result['user']
            }
            this.reservationService.createReservation(reservationToCreate);
            dialogRef.close();
          }
        );

      }
    })

  }

  openUpdateReservationFormPopup(reservation: ReservationN, year?: number, month?: number, day?: number) {
    if (!reservation) {
      return
    }
    let reservationToUpdate: ReservationN = {
      id: reservation.id,
      checkin: reservation.checkin,
      checkout: reservation.checkout,
      camperPlaceIndex: reservation.camperPlaceIndex,
      user: reservation.user,
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
        { name: 'Gość', field: 'user', type: 'select', defaultValue: reservationToUpdate.user!.firstName + " " + reservationToUpdate.user!.lastName,  replacedByAdditional: true, readonly: true},
        { name: 'Imię', field: 'firstName', type: 'text', additional: true, defaultValue: reservationToUpdate.user?.firstName },
        { name: 'Nazwisko', field: 'lastName', type: 'text', additional: true, defaultValue: reservationToUpdate.user?.lastName },
        { name: 'Rejestracja', field: 'carRegistration', type: 'text', additional: true, defaultValue: reservationToUpdate.user?.carRegistration },
        { name: 'Email', field: 'email', type: 'email', additional: true, defaultValue: reservationToUpdate.user?.email },
        { name: 'Numer Telefonu', field: 'phoneNumber', type: 'text', additional: true, defaultValue: reservationToUpdate.user?.phoneNumber },
      ]
    }
    reservationToUpdate.checkin
    const dialogRef = this.popupForm.open(PopupFormComponent, {
      data: formData
    })
    dialogRef.afterOpened().subscribe(() => {


      dialogRef.componentInstance.secondAction = () => {
        const result = dialogRef.componentInstance.formValues;
        reservationToUpdate.checkin = result['checkin']?.toString() ?? reservationToUpdate.checkin;
        reservationToUpdate.checkout = result['checkout']?.toString() ?? reservationToUpdate.checkout;
        reservationToUpdate.camperPlaceIndex = result['camperPlaceIndex']?.toString() ?? reservationToUpdate.camperPlaceIndex;
        reservationToUpdate.paid = result['paid'] ?? reservationToUpdate.paid;
        reservationToUpdate.user!.firstName = result['firstName']?.toString() ?? reservationToUpdate.user?.firstName;
        reservationToUpdate.user!.lastName = result['lastName']?.toString() ?? reservationToUpdate.user?.lastName;
        reservationToUpdate.user!.carRegistration = result['carRegistration']?.toString() ?? reservationToUpdate.user?.carRegistration;
        reservationToUpdate.user!.email = result['email']?.toString() ?? reservationToUpdate.user?.email;
        reservationToUpdate.user!.phoneNumber = result['phoneNumber']?.toString() ?? reservationToUpdate.user?.phoneNumber;

        this.popupConfirmationService.openConfirmationPopup(
          "Rezerwacja zostanie edytowana. Czy chcesz kontynuować?",
          () => {
            this.reservationService.updateReservation(reservationToUpdate)
          }
        )}
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
        { name: 'Rejestracja', field: 'registration', type: 'text'},
      ]
    };
    const dialogRef = this.popupForm.open(PopupFormComponent, {
      data: formData
    })
    dialogRef.afterOpened().subscribe(() => {
      dialogRef.componentInstance.secondAction = () => {
        const result = dialogRef.componentInstance.formValues;
        this.popupConfirmationService.openConfirmationPopup(
          "Gość zostanie dodany. Czy chcesz kontynuować?",

          () => {
            const userToCreate: UserN = {
              id: 0,
              firstName: result['firstName']?.toString() ?? '',
              lastName: result['lastName']?.toString() ?? '',
              carRegistration: result['carRegistration']?.toString() ?? '',
              email: result['email']?.toString() ?? '',
              phoneNumber: result['phoneNumber']?.toString() ?? '',
            }

            this.userService.create(userToCreate);
            dialogRef.close();
          }
        );

      }
    })

  }

  openUpdateUserPopup(user: UserN) {
    if (!user) {
      return
    }
    let userToUpdate: UserN = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      carRegistration: user.carRegistration
    };
    const formData: FormData = {
      header: 'Edycja Gościa',
      update: true,
      objectToUpdate: userToUpdate,
      formInputs: [
        { name: 'Imie', field: 'firstName', type: 'text', defaultValue: user.firstName},
        { name: 'Nazwisko', field: 'lastName', type: 'text', defaultValue: user.lastName},
        { name: 'Email', field: 'email', type: 'text',defaultValue: user.email},
        { name: 'Numer telefonu', field: 'phoneNumber', type: 'text', defaultValue: user.phoneNumber},
        { name: 'Rejestracja', field: 'carRegistration', type: 'text', defaultValue: user.carRegistration},
      ]
    }
    const dialogRef = this.popupForm.open(PopupFormComponent, {
      data: formData
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
          "Rezerwacja zostanie edytowana. Czy chcesz kontynuować?",
          () => {
            this.userService.update(userToUpdate)
          }
        )}
    })
  }
}
