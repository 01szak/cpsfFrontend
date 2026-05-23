import {Component, HostListener, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {map, Observable, Subscription, of} from 'rxjs';
import {CamperPlaceService} from '@features/settings/services/CamperPlaceService';
import {PopupFormService} from '@core/services/PopupFormService';
import {MatCard} from '@angular/material/card';
import {AsyncPipe, NgClass} from '@angular/common';
import {NewDatePickerComponent} from '@shared/ui/date-picker/new-date-picker.component';
import {ReservationFormData} from '@shared/form/reservation-form.component';
import {CamperPlaceDto, ReservationDto, SearchCriteria} from '../../../api';
import {ReservationCellComponent} from '@features/reservations/calendar/reservation-cell.component';
import {ReservationService} from '@features/reservations/services/ReservationService';
import {DateDelimiter, DateFormater} from '@shared/helper/DateFormater';
import moment from 'moment';

@Component({
  selector: 'calendar',
  imports: [
    MatCard,
    NewDatePickerComponent,
    AsyncPipe,
    ReservationCellComponent,
    NgClass,
  ],
  template: `
    <mat-card class="content">
      <mat-card class="widget-header">
        <app-new-date-picker (month)="changeMonth($event)" (year)="changeYear($event)"/>
      </mat-card>
      <div class="header-row" [style.--days]="days.length">
        <div class="header-cell camperPlaceIndex"></div>

        @for (day of days; track day) {
          <div class="header-cell">
            <p>{{ day }}</p>
            <div class="weekday">
              <p>{{ findWeekDay(year, month, day) }}</p>
            </div>
          </div>
        }
      </div>
      <div class="tableContainer">
        @if (camperPlaces$) {
          <div class="table">
            @for (camperPlace of camperPlaces$ | async; track camperPlace.id) {
              <div class="row" [style.--days]="days.length">

                <div class="cell camperPlaceIndex"><p>{{ camperPlace.index }}</p></div>

                @for (day of days; track day) {
                  <div [ngClass]="
                  {
                    'cell': true,
                    'weekend': this.isWeekend(year, month, day)
                  }"
                       (click)="$event.stopPropagation(); openReservationFormPopup(camperPlace, undefined, day)">
                  </div>
                }

                @for (res of (reservations$ | async); track res.id) {
                  @if (res.camperPlace.id === camperPlace.id && isResInCurrentMonth(res)) {
                    <app-reservation-cell
                      [reservation]="res"
                      [onlyCheckoutDisplay]="isOnlyCheckoutDisplayed(DateFormater.MOMENT(res.checkin), DateFormater.MOMENT(res.checkout))"
                      [displayedLength]="getDisplayedLength(DateFormater.MOMENT(res.checkin), DateFormater.MOMENT(res.checkout))"
                      [style.grid-column]="calcResCellLength(res)"
                      [style.left.%]="calcResPlacement(res)"
                      (click)="$event.stopPropagation(); openReservationFormPopup(camperPlace, res)"
                    />
                  }
                }

              </div>
            }
          </div>
        }
      </div>
    </mat-card>
  `,
  styles: `
    mat-card {
      padding: 25px;
      width: 100%;
      max-width: 1850px;
      justify-self: center;
      background-color: var(--bg-card) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: var(--radius-md) !important;
    }
    .header-row,
    .row {
      display: grid;
      grid-template-columns: 80px repeat(var(--days), minmax(0, 1fr));
    }

    .header-cell,
    .cell {
      border: var(--calendar-border);
      box-sizing: border-box;
    }

    .table {
      width: 100%;
      height: 100%;
      z-index: 0;
      overflow: hidden;
    }

    .row {
      display: grid;
      grid-template-columns: 80px repeat(var(--days), 1fr);
      position: relative;
      height: 40px;
    }

    app-reservation-cell {
      height: 80%;
      width: 100%;
      z-index: 100;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    app-new-date-picker {
      display: block;
      padding: 10px;
      z-index: 200;
      background: transparent;
    }

    .camperPlaceIndex {
      display: flex;
      flex-shrink: 0;
      background-color: var(--bg-card);
      z-index: 200;
      text-align: center;
    }

    .weekday {
      width: 100%;
      font-size: xx-small;
      color: var(--text-secondary);
    }

    p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 2px 0;
      justify-self: center;
    }

    .weekend {
      background-color: var(--calendar-weekend);
    }

    .widget-header {
      padding: 0;
      box-shadow: none;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
    }

  `,
  standalone: true,
})
export class CalendarPage implements OnInit, OnDestroy {
  @Input() month: number = new Date().getMonth();
  @Input() year: number = new Date().getFullYear();

  weekDays: string[] = [ "Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
  days: (number)[] = [];
  private sub = new Subscription();

  protected camperPlaces$!: Observable<CamperPlaceDto[]>;
  protected reservations$: Observable<ReservationDto[]> = of([]);
  protected reservations: ReservationDto[] = [];

  private popupFormService = inject(PopupFormService);
  private camperPlaceService = inject(CamperPlaceService);
  private reservationService = inject(ReservationService);

  constructor() {
    this.camperPlaces$ = this.camperPlaceService.camperPlacesForTable$;
    this.reservations$ = this.reservationService.reservationDtos$.pipe(
      map(page => page.content || [])
    );
  }

  ngOnInit(): void {
    this.generateDays();
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private fetchData() {
    this.sub.add(this.camperPlaceService.getCamperPlaces().subscribe());

    const startOfMonth = DateFormater.MOMENT({year: this.year, month: this.month - 1, day: 1}).startOf('month');
    const endOfMonth = DateFormater.MOMENT({year: this.year, month: this.month + 1, day: 1}).endOf('month');

    this.sub.add(this.reservationService.findByUnpaged({
      key: 'checkin',
      operation: 'BETWEEN',
      value: DateFormater.YYYYMMDD(startOfMonth, DateDelimiter.DASH),
      secondValue: DateFormater.YYYYMMDD(endOfMonth, DateDelimiter.DASH)
    } as SearchCriteria).subscribe());
  }

  changeMonth(event: number) {
    this.month = event;
    this.generateDays();
    this.fetchData();
  }

  changeYear(event: number) {
    this.year = event;
    this.generateDays();
    this.fetchData();
  }

  generateDays() {
    const daysInMonth = DateFormater.MOMENT({year: this.year, month: this.month, day: 1}).daysInMonth();
    this.days = Array.from({length: daysInMonth}, (_, i) => i + 1);
  }

  protected openReservationFormPopup(cp: CamperPlaceDto, res?: ReservationDto, day?: number) {
    const fd = {
      reservation: res,
      camperPlace: cp,
      year: this.year,
      month: this.month,
      day: day,
    } as ReservationFormData

    this.popupFormService.openReservationFormPopup(fd);
  }

  findWeekDay(year: number, month: number, day: number) {
    return this.weekDays.at(new Date(year, month, day).getDay())
  }

  isWeekend(year: number, month: number, day: number) {
    const weekDay = new Date(year, month, day).getDay();
    return weekDay == 0 || weekDay == 6;
  }

  protected calcResCellLength(res: ReservationDto): string {
    const checkin = DateFormater.MOMENT(res.checkin);
    const checkout = DateFormater.MOMENT(res.checkout);
    if (this.isOnlyCheckoutDisplayed(checkin, checkout)) {
        return '1 / span ' +  checkout.date();
    }
    return (checkin.date() + 1) + ' / span ' + this.getResLength(res);
  }

  protected calcResPlacement(res: ReservationDto): string {
    const checkin = DateFormater.MOMENT(res.checkin);
    const checkout = DateFormater.MOMENT(res.checkout);

    if (this.isOnlyCheckoutDisplayed(checkin, checkout)) {
      return (35 / checkout.date()).toString();
    }
    return this.getResLength(res) > 0 ? (50 / this.getResLength(res)).toString() : '0';
  }

  protected isOnlyCheckoutDisplayed(checkin: moment.Moment, checkout: moment.Moment) {
    return checkin.month() < checkout.month() && checkin.month() != this.month;
  }

  protected getDisplayedLength(checkin: moment.Moment, checkout: moment.Moment) {
    if (this.isOnlyCheckoutDisplayed(checkin, checkout)) {
      return checkout.date();
    }
    return this.days.length - checkin.date();
  }

  private getResLength(res: ReservationDto) {
    const checkin = DateFormater.MOMENT(res.checkin);
    const checkout = DateFormater.MOMENT(res.checkout);
    let length = 0;
    if (checkin.month() < checkout.month()) {
      let daysToEOM = checkin.daysInMonth() - checkin.date();
      length = daysToEOM + checkout.date();
    } else {
      length = checkout.date() - checkin.date();
    }
    return length;
  }

  protected isResInCurrentMonth(res: ReservationDto) {
    return DateFormater.MOMENT(res.checkin).month() === this.month || DateFormater.MOMENT(res.checkout).month() === this.month;
  }

  protected readonly DateFormater = DateFormater;
}

