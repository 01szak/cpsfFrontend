import {Injectable} from '@angular/core';
import {map, Observable, shareReplay, take} from 'rxjs';
import {NewReservationService} from '../serviceN/NewReservationService';
import {ReservationN} from './../InterfaceN/ReservationN';
import {
  ReservationMetadata,
  ReservationMetadataWithSets
} from './../InterfaceN/ReservationMetadata';
import {PaidReservations, PaidReservationsWithSets} from './../InterfaceN/PaidReservations';

@Injectable({providedIn: "root"})
export class ReservationHelper {

  reservations$: Observable<ReservationN[]>;
  reservationMap$: Observable<Map<string, Set<string>>>;

  constructor(private reservationService: NewReservationService) {
    this.reservations$ = reservationService.getReservations();

    this.reservationMap$ = this.reservations$.pipe(
      take(1),
      map(reservations => {
        const reservationMap = new Map<string, Set<string>>();

        reservations.forEach(r => {
          const key = r.camperPlaceIndex;
          const dates = this.getDatesBetween(this.mapStringToDate(r.checkin), this.mapStringToDate(r.checkout));

          if (!reservationMap.has(key)) {
            reservationMap.set(key, new Set<string>());
          }
          dates.forEach(d => reservationMap.get(key)!.add(d.toDateString()));
        });

        return reservationMap;
      }),
      shareReplay(1)
    );
  }

  getDatesBetween(first: Date, last: Date) {
    let start = new Date(first);
    start.setHours(0, 0, 0, 0);
    let end = new Date(last);
    end.setHours(0, 0, 0, 0);

    let dates: Date[] = [];

    while (start <= end) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }

    return dates;
  }

  mapStringToDate(text: string): Date {
    const year: number = Number(text.slice(0, 4));
    const month: number = Number(text.slice(5, 7));
    const day: number = Number(text.slice(8, 10));

    return new Date(year, month - 1, day)
  }
  mapDateToString (year: number, month: number, day: number) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  mapReservationMetadataToSets(rawMap: Record<string, ReservationMetadata>): Record<string, ReservationMetadataWithSets> {
    const mapped: Record<string, ReservationMetadataWithSets> = {};

    for (const key in rawMap) {
      const raw = rawMap[key];
      mapped[key] = {
        reserved: new Set(raw.reserved),
        checkin: new Set(raw.checkin),
        checkout: new Set(raw.checkout)
      };
    }

    return mapped;
  }

  mapPaidReservationsToSets(rawMap: Record<string, PaidReservations>): Record<string, PaidReservationsWithSets> {
    const mapped: Record<string, PaidReservationsWithSets> = {};

    for (const key in rawMap) {
      const raw = rawMap[key];
      mapped[key] = {
        paidDates: new Set(raw.paidDates)
      };
    }

    return mapped;
  }

  formatToStringDate(dateToFormat: string) {
    const [day, month, year] = dateToFormat.split('.').map(Number)
    return this.mapDateToString(year, month - 1, day);
  }
}
