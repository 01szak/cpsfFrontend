import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {CamperPlaceService} from '../../../../service/CamperPlaceService';
import {ReservationService} from '../../../../service/ReservationService';
import {PopupFormService} from '../../../../service/PopupFormService';
import {ReservationHelper} from '../../../../util/ReservationHelper';
import {ReservationMetadataWithSets} from '../../../Interface/ReservationMetadata';
import {CamperPlace} from '../../../Interface/CamperPlace';
import {MatCard} from '@angular/material/card';
import {AsyncPipe, NgClass} from '@angular/common';
import {NewDatePickerComponent} from '../../date-picker/new-date-picker.component';
import {PaidReservationsWithSets} from '../../../Interface/PaidReservations';
import {UserPerReservation} from '../../../Interface/UserPerReservation';
import {MatTooltip} from '@angular/material/tooltip';
import moment from 'moment';

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
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCalendarComponent implements OnInit, OnDestroy{
  @Input() month: number = new Date().getMonth();
  @Input() year: number = new Date().getFullYear();

  weekDays: string[] = moment.weekdays();
  days: (number)[] = [];
  sub!: Subscription;

  protected camperPlaces$!: Observable<CamperPlace[]>;

  protected reservationMetadataWithSets: Record<string, ReservationMetadataWithSets> = {};
  private paidReservationsWithSets: Record<string, PaidReservationsWithSets> = {};
  private unPaidReservationsWithSet: Record<string, PaidReservationsWithSets> = {};
  private userPerReservation: UserPerReservation = {};

  constructor(
    private camperPlaceService: CamperPlaceService,
    private reservationService: ReservationService,
    private reservationHelper: ReservationHelper,
    protected popupFormService: PopupFormService,
  ) {
  }


  ngOnInit(): void {
    this.generateDays();
    this.reservationService.fetchAllData().subscribe();
    this.camperPlaces$ = this.camperPlaceService.camperPlaces$;
    this.sub = this.reservationService.calendarData$.subscribe(data => {
      this.reservationMetadataWithSets = data.metadata || {};
      this.paidReservationsWithSets = data.paid;
      this.unPaidReservationsWithSet = data.unpaid;
      this.userPerReservation = data.users;
    });

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  changeMonth(event: number) {
    this.month = event;
    this.generateDays()
  }

  changeYear(event: number) {
    this.year = event;
    this.generateDays()
  }

  generateDays() {
    const daysInMonth = moment({year: this.year, month: this.month}).daysInMonth();
    this.days = Array.from({length: daysInMonth}, (_, i) => i + 1);
  }

  isDayReserved(year: number, month: number, day: number, camperPlace: CamperPlace) {
    const dateStr = this.formatDate(year, month, day);
    return this.reservationMetadataWithSets[camperPlace.index]?.reserved.has(dateStr);
  }

  isCheckin(year: number, month: number, day: number, camperPlace: CamperPlace) {
    const dateStr: string = this.formatDate(year, month, day);
    return this.reservationMetadataWithSets[camperPlace.index]?.checkin.has(dateStr);
  }

  isCheckout(year: number, month: number, day: number, camperPlace: CamperPlace) {
    const dateStr = this.formatDate(year, month, day);
    return this.reservationMetadataWithSets[camperPlace.index]?.checkout.has(dateStr);
  }

  isPaid(year: number, month: number, day: number, camperPlace: CamperPlace) {
    const dateStr = this.formatDate(year, month, day);
    return this.paidReservationsWithSets[camperPlace.index]?.paidDates.has(dateStr);
  }

  isUnPaid(year: number, month: number, day: number, camperPlace: CamperPlace) {
    const dateStr = this.formatDate(year, month, day);
    return !this.paidReservationsWithSets[camperPlace.index]?.paidDates.has(dateStr);
  }

  formatDate(year: number, month: number, day: number): string {
    return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
  }

  openFormPopup(year: number, month: number, day: number, camperPlace: CamperPlace, event: MouseEvent) {
   if (!camperPlace) {
     return;
   }
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

  getUserFromMap(cp: CamperPlace, year: number, month: number, day: number) {

    const dateStr = this.reservationHelper.mapDateToString(year, month, day);


    if (cp === undefined || !this.userPerReservation[cp.index]) {
      return;
    }

    let userMap: Map<string, string[]> = this.userPerReservation[cp.index];

    if (!userMap) {
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
          matchingUsers.push({user, type});
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
