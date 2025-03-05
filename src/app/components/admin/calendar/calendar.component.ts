import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CamperPlace} from './CamperPlace';
import {CommonModule, NgIf} from '@angular/common';

import {CamperPlaceService} from '../../../service/CamperPlaceService';
import {PopupService} from '../../../service/PopupService';
import moment from 'moment/moment';
import {MatCard} from '@angular/material/card';
import {MatTooltip} from '@angular/material/tooltip';
import {MatOption, MatSelect} from '@angular/material/select';


@Component({
  selector: 'calendar',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatCard,
    MatTooltip,
    MatSelect,
    MatOption,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  standalone: true
})
export class CalendarComponent {
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  weekdays = new Map<number, string>([[0, 'sun'], [1, 'mon'], [2, 'tue'], [3, 'wed'], [4, 'thu'], [5, 'fri'], [6, 'sat']])
  daysInAMonth: Array<number> = [];
  camperPlaces: Array<CamperPlace> = [];
  currentMonth: string = this.months[new Date().getMonth()];
  selectedMonth: string = this.currentMonth;
  today = moment(Date.now()).format('YYYY-MM-DD');

  constructor(private camperPlaceService: CamperPlaceService, private popupService: PopupService) {
  }

  openPopup() {
    this.popupService.openCamperPlacePopup();
  }

  openCreateReservationPopupFromCalendar(checkinDate: Date, camperPlaceNumber: number) {
    this.popupService.openCreateReservationPopupFromCalendar(checkinDate, camperPlaceNumber);
  }

  checkWhatWeekDayItIs(month: string, day: number) {
    const date = moment().set({date: day, month: this.months.indexOf(month)});
    return this.weekdays.get(date.day());

  }


  delete(camperPlaceNumber: number): void {
    this.camperPlaceService.deleteCamperPlace(camperPlaceNumber + 1).subscribe({
        next: () => {
          this.camperPlaces.slice(camperPlaceNumber, camperPlaceNumber + 1);
          window.location.reload()
        },
        error: (err) => {
          console.log(camperPlaceNumber);
        }
      }
    );
  }

  ngOnInit(): void {
    this.loadCamperPlaces();
    this.addNumbersToDaysInMonth();
  }

  loadCamperPlaces(): void {
    this.camperPlaceService.getAllCamperPlaces().subscribe({
      next: (data: CamperPlace[]) => {
        this.camperPlaces = data;
        console.log(this.camperPlaces)
        this.camperPlaces.forEach(cp => {
          cp.reservations.forEach(r => {
            console.log(r.paid)
          })
        })
      },
      error: (error) => {
        console.error('failed to load camper places', error);
      },
    });
  }

  addNumbersToDaysInMonth(): Array<number> {
    let days: number = this.checkHowManyDaysInMonth()
    this.daysInAMonth = new Array<number>();
    for (let i = 1; i < days; i++) {
      this.daysInAMonth = Array.from({length: days}, (_, i) => i);
    }
    return this.daysInAMonth;
  }

  checkHowManyDaysInMonth(): number {

    function isLeapYear(): boolean {
      return new Date().getFullYear() % 4 === 0;
    }

    let days: number = 0;

    switch (this.selectedMonth) {

      case 'January': {
        days = 31;
        return days;
      }
      case 'February': {
        isLeapYear() ? days = 29 : days = 28;
        return days;
      }
      case 'March': {
        days = 31;
        return days;
      }
      case 'April': {
        days = 30;
        return days;
      }
      case 'May': {
        days = 31;
        return days;
      }
      case 'June': {
        days = 30;
        return days;
      }
      case 'July': {
        days = 31;
        return days;
      }
      case 'August': {
        days = 31;
        return days;
      }
      case 'September': {
        days = 30;
        return days;
      }
      case 'October': {
        days = 31;
        return days;
      }
      case 'November': {
        days = 30;
        return days;
      }
      case 'December': {
        days = 31;
        return days;
      }
      default:
        return days;
    }

  }


  countNewReservations(): string {
    if (!this.camperPlaces) return '0';
    let todaysReservations = 0;
    const today = moment().date(new Date().getDate()).format('YYYY-MM-DD')

    this.camperPlaces.forEach(cp => {
      cp.reservations?.forEach(r => {
        if (!r.checkin) return;
        let checkin = moment().date(new Date(r.checkin).getDate()).format('YYYY-MM-DD')
        if (today === checkin) {
          todaysReservations++;
        }
      })
    })
    return todaysReservations.toString();
  }


  isDayReserved(camperPlace: CamperPlace, day: number, month: string): boolean {
    const _month = this.months.indexOf(month);
    const reservations = camperPlace.reservations;
    const td = moment({day: day, month: _month}).format('YYYY-MM-DD');

    return reservations.some(reservation => {
      return moment(td).isBetween(moment(reservation.checkin), moment(reservation.checkout), "days", '[]')

    })

  }

  protected readonly Date = Date;
  protected readonly NgIf = NgIf;
  protected readonly moment = moment;

  isCheckout(camperPlace: CamperPlace, day: number, month: number) {
    const date = moment().set({date: day, month: month}).format('YYYY-MM-DD');
    return camperPlace.reservations.some(r => {
      return date === moment(r.checkout).format('YYYY-MM-DD');
    }) ?? false;
  }

  isCheckin(camperPlace: CamperPlace, day: number, month: number) {
    const date = moment().set({date: day, month: month}).format('YYYY-MM-DD');
    return camperPlace.reservations.some(r => {
      return date === moment(r.checkin).format('YYYY-MM-DD');
    }) ?? false;
  }

  isPaid(camperPlace: CamperPlace, day: number, month: string) {

    const _month = this.months.indexOf(month);
    const td = moment({day: day, month: _month}).format('YYYY-MM-DD');

    return camperPlace.reservations.some(r => {
      return r.paid && moment(td).isBetween(moment(r.checkin), r.checkout, 'days', '[]')
    })
  }

  isNotPaid(camperPlace: CamperPlace, day: number, month: string) {
    const _month = this.months.indexOf(month);
    const td = moment({day: day, month: _month}).format('YYYY-MM-DD');

    return camperPlace.reservations.some(r => {
      return !r.paid && moment(td).isBetween(moment(r.checkin), r.checkout, 'days', '[]')
    })
  }
  hasMixedReservations(camperPlace: CamperPlace, day: number, month: string): 'paidFirst' | 'unpaidFirst' | ''{
    const _month = this.months.indexOf(month);
    const td = moment({day: day, month: _month}).format('YYYY-MM-DD');

    const sortedReservations = camperPlace.reservations;

    let firstPaid = null;
    let firstUnpaid = null;

    for(let r of sortedReservations){
      if(r.paid && firstPaid === null) firstPaid = r;
      if(!r.paid && firstUnpaid === null) firstUnpaid = r;
    }

    if(firstPaid && firstUnpaid){
      return moment(firstPaid.checkin).isBefore(moment(firstUnpaid.checkin)) ? 'paidFirst' : 'unpaidFirst'
    }
    return ''
  }
}
