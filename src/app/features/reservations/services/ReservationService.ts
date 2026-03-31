// DDD Refactored
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, forkJoin, map, Observable, Subscription, switchMap, tap} from 'rxjs';
import {ReservationMetadata, ReservationMetadataWithSets} from '@core/models/ReservationMetadata';
import {Reservation} from '@core/models/Reservation';
import {PaidReservations, PaidReservationsWithSets} from '@core/models/PaidReservations';
import {UserPerReservation} from '@core/models/UserPerReservation';
import {PageEvent} from '@angular/material/paginator';
import {Page} from '@core/models/Page';
import {ReservationHelper} from '@features/reservations/services/ReservationHelper';
import {Filter, Sort} from '@shared/ui/data-table/regular-table.component';
import {CamperPlaceService} from '@features/settings/services/CamperPlaceService';
import {BackendService} from '@core/services/BackendService';
import {BackendEntity} from '@core/models/BackendEntity';


@Injectable({providedIn: "root"})
export class ReservationService extends BackendService<Reservation> {

  public calendarData$: Observable<ReservationData>;

  constructor(
    http: HttpClient,
    private reservationHelper: ReservationHelper,
    private camperPlaceService: CamperPlaceService,
  ) {
    super(
      '/api/reservation',
      http,
      new BehaviorSubject<ReservationData | null>(null)
    );
    this.calendarData$ = this.allDataSubject.asObservable();
    this.pageData$ = this.pageDataBs.asObservable();
  }


  public getReservationMetadata() {
    return this.http.get<Record<string, ReservationMetadata>>(this.api + '/getReservationMetadata').pipe(map(r => {
      return this.reservationHelper.mapReservationMetadataToSets(r)
    }));
  }

  public getPaidReservations() {
    return this.http.get<Record<string, PaidReservations>>(this.api + '/getPaidReservations').pipe(map(r => {
      return this.reservationHelper.mapPaidReservationsToSets(r)
    }));
  }

  public getUnpaidReservations() {
    return this.http.get<Record<string, PaidReservations>>(this.api + '/getUnPaidReservations').pipe(map(r => {
      return this.reservationHelper.mapPaidReservationsToSets(r)
    }));
  }

  public getUserPerReservation() {
    return this.http.get<UserPerReservation>(this.api + '/getUserPerReservation');
  }

  public override findAll(event?: PageEvent, page?: number, size?: number, sort?: Sort, filter?: Filter): Observable<Page<Reservation>> {
    return super.findAll(event, page, size, sort, filter).pipe(
      map(p => {
        const reservations = p.content
        reservations.forEach(r => {
          r.stringUser = r.guest ? (r.guest.firstname + " " + r.guest.lastname) : '';
        })
        return p;
      }),
      tap(p => {
        this.pageDataBs.next(p);
      })
    );
  }

  public deleteReservation(r: Reservation) {
    return super.delete(r).pipe(switchMap(() => this.fetchAllData()));
  }

  public createReservation(r: Reservation) {
    return super.create(r).pipe(switchMap(() => this.fetchAllData()));
  }

  public updateReservation(r: Reservation) {
    r.checkin = this.reservationHelper.formatToStringDate(r.checkin);
    r.checkout = this.reservationHelper.formatToStringDate(r.checkout);
    return super.update(r).pipe(switchMap(() => this.fetchAllData()));
  }

  public override fetchAllData() {
    this.camperPlaceService.getCamperPlacesAsync();
    return forkJoin({
      reservations: this.findAll(this.event, this.page, this.size, this.sort, this.filter),
      metadata: this.getReservationMetadata(),
      paid: this.getPaidReservations(),
      unpaid: this.getUnpaidReservations(),
      users: this.getUserPerReservation(),
    }).pipe(
      tap(result => {
        this.allDataSubject.next(result);
      })
    );
  }

  findByDateInBetweenAndCamperPlaceId(date: string, camperPlaceId: number) {
    return this.http.get<Reservation>(this.api + '/' + date + '/' + camperPlaceId)
  }

}

type ReservationData = {
  metadata: Record<string, ReservationMetadataWithSets>,
  paid: Record<string, PaidReservationsWithSets>,
  unpaid: Record<string, PaidReservationsWithSets>,
  users: UserPerReservation,
  reservations: Page<Reservation>
}

