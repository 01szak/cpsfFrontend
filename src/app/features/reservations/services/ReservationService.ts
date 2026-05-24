import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, from, map, Observable, switchMap, tap} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {Page} from '@core/models/Page';
import {Sort} from '@shared/ui/data-table/regular-table.component';
import {Api} from '../../../api/api';
import {findBy, create, update, delete$ as deleteReservationFn} from '../../../api';
import {ReservationDto} from '../../../api/models/reservation-dto';
import {SearchCriteria} from '../../../api/models/search-criteria';
import {NotificationService} from '@core/services/NotificationService';


@Injectable({providedIn: "root"})
export class ReservationService {
  private api = inject(Api);
  private notification = inject(NotificationService);

  private reservationSubject = new BehaviorSubject<Page<ReservationDto>>({content: [], number: 0, size: 0, totalElements: 0, totalPages: 0});
  public reservationDtos$ = this.reservationSubject.asObservable();

  private lastQueryParams: {
    event?: PageEvent,
    page?: number,
    size?: number,
    sort?: Sort,
    searchCriteria?: SearchCriteria
  } = {};

  public findBy(event?: PageEvent, page?: number, size?: number, sort?: Sort, searchCriteria?: SearchCriteria): Observable<Page<ReservationDto>> {
    this.lastQueryParams = {
      event: event,
      page: page,
      size: size,
      sort: sort,
      searchCriteria: searchCriteria
    }

    const pageable = {
      page: event ? event.pageIndex : (page || 0),
      size: event ? event.pageSize : (size || 10),
      sort: sort ? [sort.columnName + ',' + sort.direction] : undefined
    };

    return from(this.api.invoke(findBy, {
      pageable: pageable,
      searchCriteria: searchCriteria || { key: '', value: '' }
    })).pipe(
      map(p => {
        const page = p as unknown as Page<ReservationDto>;
        return page;
      }),
      tap(p => {
        this.reservationSubject.next(p);
      })
    );
  }

  public findByUnpaged(searchCriteria?: SearchCriteria): Observable<Page<ReservationDto>> {
    return this.findBy(undefined, 0, 1000, undefined, searchCriteria);
  }

  public deleteReservation(r: ReservationDto) {
    return from(this.api.invoke(deleteReservationFn, { id: Number(r.id!) }))
      .pipe(
        tap({
          next: (response: any) => this.notification.success(response),
          error: (error) => this.notification.error(error)
        }),
        switchMap(() => this.refreshData())
      );
  }

  public create(r: ReservationDto) {
    return from(this.api.invoke(create, { body: r as unknown as ReservationDto }))
      .pipe(
        tap({
          next: (response: any) => this.notification.success(response),
          error: (error) => this.notification.error(error)
        }),
        switchMap(() => this.refreshData())
      );
  }

  public update(r: ReservationDto) {
    return from(this.api.invoke(update, { body: r as unknown as ReservationDto }))
      .pipe(
        tap({
          next: (response: any) => this.notification.success(response),
          error: (error) => this.notification.error(error)
        }),
        switchMap(() => this.refreshData())
      );
  }

  private refreshData(): Observable<Page<ReservationDto>> {
    const { event, page, size, sort, searchCriteria } = this.lastQueryParams;
    return this.findBy(event, page, size, sort, searchCriteria);
  }

}
