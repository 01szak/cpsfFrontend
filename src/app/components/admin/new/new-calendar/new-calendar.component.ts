import {Component, Input, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
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
import {UserPerReservation} from './../InterfaceN/UserPerReservation';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-new-calendar',
  imports: [
    MatCard,
    NgClass,
    AsyncPipe,
    NewDatePickerComponent,
    MatTooltip
  ],
  templateUrl: './new-calendar.component.html',
  styleUrl: './new-calendar.component.css',
  standalone: true,
})
export class NewCalendarComponent implements OnInit, OnDestroy {
  weekDays: string[] = [ "Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
  days: (number)[] = [];
  @Input() month: number = new Date().getMonth();
  @Input() year: number = new Date().getFullYear();
  subs: Subscription[] = []
  camperPlaces$: Observable<CamperPlaceN[]>;
  reservationMetadataWithSets: Record<string, ReservationMetadataWithSets> = {};
  paidReservationsWithSet: Record<string, PaidReservationsWithSets> = {};
  unPaidReservationsWithSet: Record<string, PaidReservationsWithSets> = {};
  userPerReservations: UserPerReservation = {};

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

    this.subs.push(this.reservationService.getReservationMetadata().subscribe(r => {
        this.reservationMetadataWithSets = this.reservationHelper.mapReservationMetadataToSets(r);
      }
    ))
    this.subs.push(
      this.reservationService.getPaidReservations().subscribe(r => {
        this.paidReservationsWithSet = this.reservationHelper.mapPaidReservationsToSets(r)
      })
    )
    this.subs.push(
      this.reservationService.getUnPaidReservations().subscribe(r => {
        this.unPaidReservationsWithSet = this.reservationHelper.mapPaidReservationsToSets(r)
      }))
    this.subs.push(
      this.reservationService.getUserPerReservation().subscribe(r => {
        this.userPerReservations = r
      }))

  }
  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe()
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    const value = changes['reservationMap'];
    if (value.currentValue) {

    }
  }

  changeMonth(event: number) {
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
    const target = event.target as HTMLElement;
    const date = new Date(year, month, day);

    const isLeft = target.classList.contains('left');
    const isRight = target.classList.contains('right');

    let reservationToUpdate;

    if (isLeft) {
      reservationToUpdate = camperPlace.reservations.find(r => {
        const checkout = this.reservationHelper.mapStringToDate(r.checkout);
        const checkin = this.reservationHelper.mapStringToDate(r.checkin);
        return date.getTime() <= checkout.getTime() && date.getTime() > new Date(checkin.getFullYear(), checkin.getMonth(), checkin.getDate() - 1).getTime();
      });
    } else if (isRight) {
      reservationToUpdate = camperPlace.reservations.find(r => {
        const checkout = this.reservationHelper.mapStringToDate(r.checkout);
        const checkin = this.reservationHelper.mapStringToDate(r.checkin);
        return date.getTime() >= checkin.getTime()
              && date.getTime() < new Date(checkout.getFullYear(), checkout.getMonth(), checkout.getDate()).getTime();
      });
    }
    if (reservationToUpdate) {
      this.popupFormService.openUpdateReservationFormPopup(reservationToUpdate, year, month, day);
    } else {
      this.popupFormService.openCreateReservationFormPopup(camperPlace, year, month, day);
    }
  }

  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  findWeekDay(year: number, month: number, day: number) {
    return this.weekDays.at(new Date(year, month, day).getDay())
  }
  isWeekend(year: number, month: number, day: number) {
    const weekDay = new Date(year, month, day).getDay();
    return weekDay == 0 || weekDay == 6;
  }

  getUserFromMap(cp: CamperPlaceN, year: number, month: number, day: number) {

    const dateStr =  (this.isCheckin(year, month, day, cp ) && this.isCheckout(year, month, day, cp)) ?
      this.reservationHelper.mapDateToString(year, month, day - 1) : this.reservationHelper.mapDateToString(year, month, day);


    if (cp === undefined || !this.userPerReservations?.[cp.index]) {
      return ;
    }

    const userMap = this.userPerReservations[cp.index.toString()];

    if(!userMap) {
      return ;
    }
    const matchingUsers: string[] = [];

    for (const [user, dates] of Object.entries(userMap)) {
      if (dates.includes(dateStr)) {
          matchingUsers.push(user)
      }
    }

    return matchingUsers.length > 1 ? `${matchingUsers[0]} / ${matchingUsers[1]}` : matchingUsers[0];
  }
}
