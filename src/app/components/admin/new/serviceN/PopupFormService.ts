import {inject, Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {NewReservationService} from '../serviceN/NewReservationService';
import {NewUserService} from '../serviceN/NewUserService';
import {PopupConfirmationService} from '../serviceN/PopupConfirmationService';
import {ReservationHelper} from '../serviceN/ReservationHelper';
import {CamperPlaceN} from './../InterfaceN/CamperPlaceN';
import {UserN} from './../InterfaceN/UserN';
import {ReservationN} from './../InterfaceN/ReservationN';
import {PopupFormComponent, FormData} from './../popup-form/popup-form.component';

@Injectable({providedIn: "root"})
export class PopupFormService {
  readonly popupForm: MatDialog = inject(MatDialog);
  users$: Observable<UserN[]>;
  constructor(
    private popupConfirmationService: PopupConfirmationService,
    private reservationService: NewReservationService,
    private userService: NewUserService,
    private reservationHelper: ReservationHelper,
  ) {
    this.users$ = this.userService.getUsers()
  }
  openCreateReservationFormPopup(camperPlace: CamperPlaceN, year?: number, month?: number, day?: number) {
    const checkinDefaultDate = (year === undefined || month === undefined || day === undefined) ? undefined : new Date(year, month, day);
    const formData: FormData = {
      header: 'Nowa rezerwacja',
      formInputs: [
        { name: 'Data wjazdu', field: 'checkin', type: 'date', defaultValue: checkinDefaultDate, readonly: checkinDefaultDate instanceof Date},
        { name: 'Data wyjazdu', field: 'checkout', type: 'date'},
        { name: 'Numer parceli', field: 'camperPlaceIndex', type: 'text', defaultValue: camperPlace.index, readonly: camperPlace.index.length > 0},
        { name: 'Gość', field: 'user', type: 'text', select: true, selectList: this.users$},
        { name: 'Imię', field: 'firstName', type: 'text', additional: true },
        { name: 'Nazwisko', field: 'lastName', type: 'text', additional: true },
        { name: 'Rejestracja', field: 'carRegistration', type: 'text', additional: true },
        { name: 'Email', field: 'email', type: 'email', additional: true },
        { name: 'Numer Telefonu', field: 'phoneNumber', type: 'tel', additional: true },
        { name: 'Kraj', field: 'country', type: 'text', additional: true },
        { name: 'Miasto', field: 'city', type: 'text', additional: true },
        { name: 'Adres', field: 'streetAddress', type: 'text', additional: true },

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
              firstName: result['firstName']?.toString() ?? '',
              lastName: result['lastName']?.toString() ?? '',
              carRegistration: result['carRegistration']?.toString() ?? '',
              email: result['email']?.toString() ?? '',
              phoneNumber: result['phoneNumber']?.toString() ?? '',
              country: result['country']?.toString() ?? '',
              city: result['city']?.toString() ?? '',
              streetAddress: result['street']?.toString() ?? '',
            }
            const reservationToCreate: ReservationN = {
              isPaid: false,
              camperPlaceIndex: result['camperPlaceIndex'].toString() ?? '',
              checkin: result['checkin'].toString() ?? '',
              checkout: result['checkout'].toString() ?? '',
              price: 0,
              user: result['isNewGuest'] ? userToCreate : result['user']
            }

            console.log(reservationToCreate)

            this.reservationService.createReservation(reservationToCreate);
            dialogRef.close();
          }
        );

      }
    })

  }

  openUpdateReservationFormPopup(camperPlace: CamperPlaceN, year: number, month: number, day: number) {
    const date = new Date(year, month, day);

    const reservationToUpdate = camperPlace.reservations.find(
      r =>
        this.reservationHelper
          .getDatesBetween(
            this.reservationHelper.mapStringToDate(r.checkin),
            this.reservationHelper.mapStringToDate(r.checkout))
          .some(d => d.getTime() === date.getTime())
    )
    console.log(reservationToUpdate)
    if (!reservationToUpdate) {
      return
    }
    const formData: FormData = {
      header: 'Edycja Rezerwacji',
      update: true,
      objectToUpdate: reservationToUpdate,
      formInputs: [
        { name: 'Data wjazdu', field: 'checkin', type: 'date', defaultValue: reservationToUpdate.checkin},
        { name: 'Data wyjazdu', field: 'checkout', type: 'date', defaultValue: reservationToUpdate.checkout},
        { name: 'Numer Parceli', field: 'camperPlaceIndex', type: 'text', defaultValue: camperPlace.index},
        { name: 'Gość', field: 'user', type: 'text', defaultValue: reservationToUpdate.user.firstName + " " + reservationToUpdate.user.lastName, readonly: true},
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
        console.log(reservationToUpdate)

        this.popupConfirmationService.openConfirmationPopup(
          "Rezerwacja zostanie edytowana. Czy chcesz kontynuować?",
          () => {
            this.reservationService.updateReservation(reservationToUpdate)
          }
        )}
    })
  }
}
