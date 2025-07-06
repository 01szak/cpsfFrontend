import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {NewCamperPlaceService} from '../serviceN/NewCamperPlaceService';
import {NewReservationService} from '../serviceN/NewReservationService';
import {PopupFormService} from '../serviceN/PopupFormService';
import {ReservationHelper} from '../serviceN/ReservationHelper';
import {ReservationMetadataWithSets} from './../InterfaceN/ReservationMetadata';
import {CamperPlaceN} from './../InterfaceN/CamperPlaceN';
import {MatCard} from '@angular/material/card';
import {AsyncPipe, NgClass} from '@angular/common';
import {NewDatePickerComponent} from './../new-date-picker/new-date-picker.component';
import {PaidReservationsWithSets} from './../InterfaceN/PaidReservations';
@Component({
  selector: 'app-new-calendar',
  imports: [
    MatCard,
    NgClass,
    AsyncPipe,
    NewDatePickerComponent
  ],
  templateUrl: './new-calendar.component.html',
  styleUrl: './new-calendar.component.css',
  standalone: true,
})
export class NewCalendarComponent implements OnInit {
  weekDays: string[] = [ "Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
  days: (number)[] = [];
  @Input() month: number = new Date().getMonth();
  @Input() year: number = new Date().getFullYear();
  camperPlaces$: Observable<CamperPlaceN[]>;
  reservationMetadataWithSets: Record<string, ReservationMetadataWithSets> = {};
  paidReservationsWithSet: Record<string, PaidReservationsWithSets> = {};
  unPaidReservationsWithSet: Record<string, PaidReservationsWithSets> = {};
  constructor(
    private camperPlaceService: NewCamperPlaceService,
    protected popupFormService: PopupFormService,
    private reservationService: NewReservationService,
    private reservationHelper: ReservationHelper,
  ) {
    this.camperPlaces$ = this.camperPlaceService.getCamperPlaces();
  }

  ngOnInit(): void {
    this.generateDays()

    this.reservationService.getReservationMetadata().subscribe(r => {
        this.reservationMetadataWithSets = this.reservationHelper.mapReservationMetadataToSets(r);
        console.log(this.reservationMetadataWithSets)

      }
    )

    this.reservationService.getPaidReservations().subscribe(r => {
      console.log(r)

      this.paidReservationsWithSet = this.reservationHelper.mapPaidReservationsToSets(r)
      console.log(this.paidReservationsWithSet)
    })
    this.reservationService.getUnPaidReservations().subscribe(r => {
      console.log(r)

      this.unPaidReservationsWithSet = this.reservationHelper.mapPaidReservationsToSets(r)
      console.log(this.paidReservationsWithSet)
    })

  }

  ngOnChanges(changes: SimpleChanges) {
    const value = changes['reservationMap'];
    if (value.currentValue) {

    }
  }

  changeMonth(event:number) {
    this.month = event;
    this.generateDays()
  }

  changeYear(event:number) {
    this.year = event;
    this.generateDays()
  }

  generateDays() {
    this.days = []
    const firstDay = new Date(this.year, this.month, 1).getDay();
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      this.days.push(i);
    }
  }

  isDayReserved(year: number, month: number, day: number, camperPlace: CamperPlaceN) {
    const dateStr = this.formatDate(year, month, day);
    return this.reservationMetadataWithSets[camperPlace.index]?.reserved.has(dateStr);
  }

  isCheckin(year: number, month: number, day: number, camperPlace: CamperPlaceN) {
    const dateStr = this.formatDate(year, month, day);
    return this.reservationMetadataWithSets[camperPlace.index]?.checkin.has(dateStr);
  }

  isCheckout(year: number, month: number, day: number, camperPlace: CamperPlaceN) {
    const dateStr = this.formatDate(year, month, day);
    return this.reservationMetadataWithSets[camperPlace.index]?.checkout.has(dateStr);
  }

  isPaid(year: number, month: number, day: number, camperPlace: CamperPlaceN) {
    const dateStr = this.formatDate(year, month, day);
    return this.paidReservationsWithSet[camperPlace.index]?.paidDates.has(dateStr);
  }
  isUnPaid(year: number, month: number, day: number, camperPlace: CamperPlaceN) {
    const dateStr = this.formatDate(year, month, day);
    return this.unPaidReservationsWithSet[camperPlace.index]?.paidDates.has(dateStr);
  }

  formatDate(year: number, month: number, day: number): string {
    return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
  }

  openFormPopup(year: number, month: number, day: number, camperPlace: CamperPlaceN, event: MouseEvent) {
    const  target = event.target as HTMLElement

    if(target.classList.contains('nextToCheckout') && !target.classList.contains('reserved')) {
      this.popupFormService.openCreateReservationFormPopup(camperPlace, year, month, day);
    } else {
      if (this.isDayReserved(year, month, day, camperPlace)) {
        this.popupFormService.openUpdateReservationFormPopup(camperPlace, year, month, day);
      } else {
        this.popupFormService.openCreateReservationFormPopup(camperPlace, year, month, day);
      }
    }

  }

  findWeekDay(year: number, month: number, day: number) {
    return this.weekDays.at(new Date(year, month, day).getDay())
  }
  isWeekend(year: number, month: number, day: number) {
    const weekDay = new Date(year, month, day).getDay();
    return weekDay == 0 || weekDay == 6;
  }
}
