import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CamperPlace} from './CamperPlace';
import {CommonModule} from '@angular/common';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as url from 'node:url';
import {ConfigService} from '../../../service/ConfigService';
import {Preform} from '../../../Preform';
import * as http from 'node:http';

@Component({
  selector: 'app-calendar',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatButton,

  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  standalone: true
})
export class CalendarComponent {
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  daysInAMonth: Array<number> = [];
  selectedMonth: string = ''
  storage: Storage = window.localStorage;
  data = new Preform<CamperPlace>();
  camperPlaces: Array<CamperPlace> = [];

  constructor(private ConfigService: ConfigService) {
  }

  ngOnInit(): void {
    this.loadCamperPlaces();
  }

  loadCamperPlaces(): void {
    this.ConfigService.getAllCamperPlaces().subscribe({
      next: (data: any[]) => {
        this.camperPlaces = data;
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


  // addCamperPlace() {
  //   this.camperPlaces.push(this.camperPlaces);
  //   this.storage.setItem("camperPlaces", this.camperPlaces.toString());
  // }

  checkHowManyDaysInMonth(): number {

    function isLeapYear(): boolean {
      let currentDate = new Date()
      return currentDate.getFullYear() % 4 === 0;
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

  deleteCamperPlace() {
    this.camperPlaces.pop();
  }
}
