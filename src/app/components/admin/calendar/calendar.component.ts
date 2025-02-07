import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CamperPlace} from './CamperPlace';
import {CommonModule} from '@angular/common';

import {CamperPlaceService} from '../../../service/CamperPlaceService';
import {PopupService} from '../../../service/PopupService';
import moment from 'moment/moment';


@Component({
  selector: 'calendar',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  standalone: true
})
export class CalendarComponent {
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  daysInAMonth: Array<number> = [];
  camperPlaces: Array<CamperPlace> = [];
  currentMonth: string = this.months[new Date().getMonth()];
  selectedMonth: string = this.currentMonth;

  constructor(private camperPlaceService: CamperPlaceService, private popupService: PopupService) {
  }

  openPopup() {
    this.popupService.openCamperPlacePopup();
  }



  delete(camperPlaceNumber: number): void {
    this.camperPlaceService.deleteCamperPlace(camperPlaceNumber + 1).subscribe({
        next: () => {
          this.camperPlaces.slice(camperPlaceNumber,camperPlaceNumber + 1);
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
        console.log(data)
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
  isDayReserved(camperPlace: CamperPlace, day: number,month: number): [boolean, string,string] {

    const days: string[] = [];
    let monthOfTheReservation1: string = "";
    let monthOfTheReservation2:string = "";


    camperPlace.reservations?.forEach(r => {
      console.log(r);
      if (r.status === 'EXPIRED') {
        return;
      }

      const startDate = moment(r.checkin);
      const endDate =  moment(r.checkout);
      monthOfTheReservation1 = this.months.at(startDate.month()) || "";
      monthOfTheReservation2 = this.months.at(endDate.month()) || "";
      while (startDate.isSameOrBefore(endDate)) {

        days.push(startDate.format('YYYY-MM-DD'));

        startDate.add(1, 'day');
      }
    })
    const date = moment().set({ date: day + 1, month: month }).format('YYYY-MM-DD');
    return [days.includes(date),monthOfTheReservation1,monthOfTheReservation2]


  }

  countNewReservations():string {
    if (!this.camperPlaces) return '0';
    let todaysReservations = 0;
    const today = moment().date(new Date().getDate()).format('YYYY-MM-DD')

    this.camperPlaces.forEach(cp => {
      cp.reservations?.forEach(r =>{
        if (!r.checkin) return;
          let checkin = moment().date(new Date(r.checkin).getDate()).format('YYYY-MM-DD')
        if(today === checkin){
          todaysReservations ++;
        }
      })
    })
    return todaysReservations.toString();
  }
}
