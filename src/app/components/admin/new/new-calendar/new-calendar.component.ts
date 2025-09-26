import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, Subscription, tap} from 'rxjs';
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
    NewDatePickerComponent,
    MatTooltip,
    AsyncPipe,
  ],
  templateUrl: './new-calendar.component.html',
  styleUrl: './new-calendar.component.css',
  standalone: true,
})
export class NewCalendarComponent implements OnInit, OnDestroy {
  @Input() month: number = new Date().getMonth();
  @Input() year: number = new Date().getFullYear();

  weekDays: string[] = [ "Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
  days: (number)[] = [];

  subs: Subscription[] = []

  reservationMetadataWithSets$!: Observable<Record<string, ReservationMetadataWithSets>>;
  paidReservationsWithSet$!: Observable<Record<string, PaidReservationsWithSets>>;
  unPaidReservationsWithSet$!: Observable<Record<string, PaidReservationsWithSets>>;
  userPerReservations$!: Observable<UserPerReservation>;
  camperPlaces$!: Observable<CamperPlaceN[]>;

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
  }


  ngOnInit(): void {
    this.generateDays()
    this.reservationService.getReservationMetadata();
    this.reservationService.getPaidReservations();
    this.reservationService.getUnPaidReservations();
    this.reservationService.getUserPerReservation();
    this.camperPlaceService.getCamperPlacesAsync();

    this.reservationMetadataWithSets$ = this.reservationService.reservationsMetadata$.pipe(
      map(r => this.reservationHelper.mapReservationMetadataToSets(r))
    );

    this.paidReservationsWithSet$ = this.reservationService.paidReservations$.pipe(
      map(r => this.reservationHelper.mapPaidReservationsToSets(r))
    );

    this.unPaidReservationsWithSet$ = this.reservationService.unPaidReservations$.pipe(
      map(r => this.reservationHelper.mapPaidReservationsToSets(r))
    );

    this.userPerReservations$ = this.reservationService.userPerReservations$;

    this.camperPlaces$ = this.camperPlaceService.camperPlaces$;

    this.subs.push(
      this.reservationMetadataWithSets$.subscribe(r => this.reservationMetadataWithSets = r)
    );
    this.subs.push(
      this.paidReservationsWithSet$.subscribe(r => this.paidReservationsWithSet = r)
    );
    this.subs.push(
      this.userPerReservations$.subscribe(r => this.userPerReservations = r)
    );
    this.subs.push(
      this.unPaidReservationsWithSet$.subscribe(r => this.unPaidReservationsWithSet = r)
    );
  }
  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe()
    })
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
    const dateStr: string = this.formatDate(year, month, day);
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
    return !this.paidReservationsWithSet[camperPlace.index]?.paidDates.has(dateStr);
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
        const checkoutStr = this.reservationHelper.formatToStringDate(r.checkout);
        const checkinStr = this.reservationHelper.formatToStringDate(r.checkin);
        const checkin = new Date(checkinStr);
        const checkout = new Date(checkoutStr);
        checkin.setHours(0, 0, 0, 0);
        checkout.setHours(0, 0, 0, 0);
        return date.getTime() <= checkout.getTime() && date.getTime() > new Date(checkin.getFullYear(), checkin.getMonth(), checkin.getDate() - 1).getTime();
      });
    } else if (isRight) {
      reservationToUpdate = camperPlace.reservations.find(r => {
        const checkoutStr = this.reservationHelper.formatToStringDate(r.checkout);
        const checkinStr = this.reservationHelper.formatToStringDate(r.checkin);
        const checkin = new Date(checkinStr);
        const checkout = new Date(checkoutStr);
        checkin.setHours(0, 0, 0, 0);
        checkout.setHours(0, 0, 0, 0);
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

    const dateStr =  this.reservationHelper.mapDateToString(year, month, day);


    if (cp === undefined || !this.userPerReservations[cp.index]) {
      return;
    }

    let userMap: Map<string, string[]> = this.userPerReservations[cp.index];

    if(!userMap) {
      return;
    }

    const matchingUsers: { user: string; type: ReservationEventType }[] = [];
    for (const [user, dates] of Object.entries(userMap)) {
      for (const dateWithTag of dates) {
        // Rozbijamy np. "2025-09-15 in" → ["2025-09-15", "in"]
        const [date, tag] = dateWithTag.split(' ');
        if (date === dateStr) {
          const type: ReservationEventType = tag === "in"
            ? "checkin"
            : tag === "out"
              ? "checkout"
              : "middle";
          matchingUsers.push({ user, type });
        }
      }
    }
    const order: Record<ReservationEventType, number> = {
      checkout: 0,
      checkin: 1,
      middle: 2,
    };

    matchingUsers.sort((a, b) => order[a.type] - order[b.type]);

    if (matchingUsers.length > 1) {
    return matchingUsers[0].user + ' / ' + matchingUsers[1].user
    } else {
      return matchingUsers[0]?.user;
    }

  }
}
// @ts-ignore
type ReservationEventType = "checkin" | "checkout" | "middle";
