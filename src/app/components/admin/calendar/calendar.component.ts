import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CamperPlace} from './CamperPlace';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-calendar',
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  camperPlaces: Array<CamperPlace> = [];
  daysInAMonth: Array<number> = [];



  addNumbersToDaysInMonth(month :string) {
    let days : number = this.checkHowManyDaysInMonth(month)
    for (let i = 1; i < days; i++) {
      this.daysInAMonth.push(i + 1);
    }
  }

  checkHowManyDaysInMonth(month: string):number {
    function isLeapYear(): boolean {
      let currentDate = new Date()
      return currentDate.getFullYear() % 4 === 0;
    }

    let days: number = 0;

    switch (month) {
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
}
