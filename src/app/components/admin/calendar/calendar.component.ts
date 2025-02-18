import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CamperPlace} from './CamperPlace';
import {CommonModule, NgIf} from '@angular/common';

import {CamperPlaceService} from '../../../service/CamperPlaceService';
import {PopupService} from '../../../service/PopupService';
import moment from 'moment/moment';
import {MatCard} from '@angular/material/card';
import {MatTooltip} from '@angular/material/tooltip';


@Component({
  selector: 'calendar',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatCard,
    MatTooltip,
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
  today: number = new Date().getDate();

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
        this.camperPlaces = data || [];
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

  isDayReserved(camperPlace: CamperPlace, day: number, month: number): [boolean, string, string, string] {

    const days: string[] = [];
    let monthOfTheReservation1: string = "";
    let monthOfTheReservation2: string = "";
    let reservationStatus: string = "";

    camperPlace.reservations?.forEach(r => {
      if (r.reservationStatus === 'EXPIRED') {
        return;
      }

      const startDate = moment(r.checkin);
      const endDate = moment(r.checkout);
      monthOfTheReservation1 = this.months.at(startDate.month()) || "";
      monthOfTheReservation2 = this.months.at(endDate.month()) || "";
      while (startDate.isSameOrBefore(endDate)) {
        const formattedDate = startDate.format('YYYY-MM-DD')
        days.push(formattedDate);

        if(formattedDate === moment().set({ date: day + 1, month: month }).format('YYYY-MM-DD')){
          reservationStatus = r.reservationStatus
        }
        startDate.add(1, 'day');
      }
    })
    const date = moment().set({date: day + 1, month: month}).format('YYYY-MM-DD');
    return [days.includes(date), monthOfTheReservation1, monthOfTheReservation2, reservationStatus || ""]
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

  protected readonly Date = Date;
  protected readonly NgIf = NgIf;
  protected readonly moment = moment;

  isCheckout(camperPlace: CamperPlace, day: number, month: number) {
    const date = moment().set({date: day, month:month}).format('YYYY-MM-DD');
    return camperPlace.reservations.some(r =>{
      return date === moment(r.checkout).format('YYYY-MM-DD');
    }) ?? false;
  }
  isCheckin(camperPlace: CamperPlace, day: number, month: number) {
    const date = moment().set({date: day, month:month}).format('YYYY-MM-DD');
    return camperPlace.reservations.some(r =>{
      return date === moment(r.checkin).format('YYYY-MM-DD');
    }) ?? false;
  }
}
