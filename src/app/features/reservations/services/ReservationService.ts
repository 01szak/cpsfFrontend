// DDD Refactored
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, forkJoin, from, map, Observable, switchMap, tap} from 'rxjs';
import {ReservationMetadata, ReservationMetadataWithSets} from '@core/models/ReservationMetadata';
import {Reservation} from '@core/models/Reservation';
import {PaidReservations, PaidReservationsWithSets} from '@core/models/PaidReservations';
import {UserPerReservation} from '@core/models/UserPerReservation';
import {PageEvent} from '@angular/material/paginator';
import {Page} from '@core/models/Page';
import {ReservationHelper} from '@features/reservations/services/ReservationHelper';
import {Filter, Sort} from '@shared/ui/data-table/regular-table.component';
import {CamperPlaceService} from '@features/settings/services/CamperPlaceService';
import {Api} from '../../../api/api';
import {findAll, create, update, delete$ as deleteReservationFn, getReservationMetadata, getPaidReservations, getUnPaidReservations, getUserPerReservation1, getUserPerReservation} from '../../../api';
import {ReservationDto} from '../../../api/models/reservation-dto';
import {NotificationService} from '@core/services/NotificationService';


@Injectable({providedIn: "root"})
export class ReservationService {
  private api = inject(Api);
  private http = inject(HttpClient);
  private reservationHelper = inject(ReservationHelper);
  private camperPlaceService = inject(CamperPlaceService);
  private notification = inject(NotificationService);

  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  public refreshed$ = this.refreshTrigger$.asObservable();

  private pageDataBs = new BehaviorSubject<Page<Reservation>>({content: [], number: 0, size: 0, totalElements: 0, totalPages: 0});
  public pageData$ = this.pageDataBs.asObservable();

  private calendarDataBs = new BehaviorSubject<ReservationData | null>(null);
  public calendarData$ = this.calendarDataBs.asObservable();

  public notifyChange() {
    this.refreshTrigger$.next();
  }

  public getReservationMetadata() {
    return from(this.api.invoke(getReservationMetadata)).pipe(map(r => {
      return this.reservationHelper.mapReservationMetadataToSets(r as Record<string, ReservationMetadata>)
    }));
  }

  public getPaidReservations() {
    return from(this.api.invoke(getPaidReservations)).pipe(map(r => {
      return this.reservationHelper.mapPaidReservationsToSets(r as Record<string, PaidReservations>)
    }));
  }

  public getUnpaidReservations() {
    return from(this.api.invoke(getUnPaidReservations)).pipe(map(r => {
      return this.reservationHelper.mapPaidReservationsToSets(r as Record<string, PaidReservations>)
    }));
  }

  public getUserPerReservation() {
    return from(this.api.invoke(getUserPerReservation1)) as unknown as Observable<UserPerReservation>;
  }

  public findAll(event?: PageEvent, page?: number, size?: number, sort?: Sort, filter?: Filter): Observable<Page<Reservation>> {
    const pageable = {
      page: event ? event.pageIndex : (page || 0),
      size: event ? event.pageSize : (size || 10),
      sort: sort ? [sort.columnName + ',' + sort.direction] : undefined
    };

    return from(this.api.invoke(findAll, {
      pageable: pageable,
      by: filter?.by,
      value: filter?.value
    })).pipe(
      map(p => {
        const page = p as unknown as Page<Reservation>;
        const reservations = page.content;
        reservations.forEach(r => {
          r.stringUser = r.guest ? (r.guest.firstname + " " + r.guest.lastname) : '';
          r.camperPlaceIndex = r.camperPlace.index;
        })
        return page;
      }),
      tap(p => {
        this.pageDataBs.next(p);
      })
    );
  }

  public deleteReservation(r: Reservation) {
    return from(this.api.invoke(deleteReservationFn, { id: Number(r.id!) }))
        .pipe(
            tap({
                next: (response: any) => {
                    this.notification.success(response);
                    this.notifyChange();
                },
                error: (error) => this.notification.error(error)
            }),
            switchMap(() => this.fetchAllData())
        );
  }

  public create(r: Reservation) {
    return from(this.api.invoke(create, { body: r as unknown as ReservationDto }))
      .pipe(
        tap({
          next: (response: any) => {
            this.notification.success(response);
            this.notifyChange();
          },
          error: (error) => {
            this.notification.error(error);
          }
        }),
        switchMap(() => this.fetchAllData())
      );
  }

  public update(r: Reservation) {
    // Some basic formatting might be needed if dates are not strings yet
    // But usually DateFormater handles it before calling service
    return from(this.api.invoke(update, { body: r as unknown as ReservationDto }))
      .pipe(
        tap({
            next: (response: any) => {
              this.notification.success(response);
              this.notifyChange();
            },
            error: (error) => {
              this.notification.error(error);
            }
          }
        ),
        switchMap(() => this.fetchAllData())
      );
  }

  public fetchAllData() {
    this.camperPlaceService.getCamperPlacesAsync();
    return forkJoin({
      reservations: this.findAll(undefined, 0, 10), // Default page
      metadata: this.getReservationMetadata(),
      paid: this.getPaidReservations(),
      unpaid: this.getUnpaidReservations(),
      users: this.getUserPerReservation(),
    }).pipe(
      tap(result => {
        this.calendarDataBs.next(result);
      })
    );
  }

  findByDateInBetweenAndCamperPlaceId(date: string, camperPlaceId: number): Observable<Reservation[]> {
    return from(this.api.invoke(getUserPerReservation, { date, camperPlaceId })) as unknown as Observable<Reservation[]>;
  }

}

export type ReservationData = {
  metadata: Record<string, ReservationMetadataWithSets>,
  paid: Record<string, PaidReservationsWithSets>,
  unpaid: Record<string, PaidReservationsWithSets>,
  users: UserPerReservation,
  reservations: Page<Reservation>
}
