import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, from, map, Observable, switchMap, tap} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {Page} from '@core/models/Page';
import {Sort} from '@shared/ui/data-table/regular-table.component';
import {Api} from '../../../api/api';
import {GuestDto} from '../../../api/models/guest-dto';
import {SearchCriteria} from '../../../api/models/search-criteria';
import {NotificationService} from '@core/services/NotificationService';
import {create1, deleteGuest, findBy1, update1} from '../../../api';

// TODO meaby there is a way to have one facade for all dtos? eventually override if needed
@Injectable({providedIn: "root"})
export class GuestService {
  private api = inject(Api);
  private notification = inject(NotificationService);

  private guestSubject = new BehaviorSubject<Page<GuestDto>>({content: [], number: 0, size: 0, totalElements: 0, totalPages: 0});
  public guestDtos$ = this.guestSubject.asObservable();

  private lastQueryParams: {
    event?: PageEvent,
    page?: number,
    size?: number,
    sort?: Sort,
    searchCriteria?: SearchCriteria
  } = {};

  public findBy(event?: PageEvent, page?: number, size?: number, sort?: Sort, searchCriteria?: SearchCriteria): Observable<Page<GuestDto>> {
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

    return from(this.api.invoke(findBy1, {
      pageable: pageable,
      searchCriteria: searchCriteria || { key: '', value: '' }
    })).pipe(
      map(p => {
        const page = p as unknown as Page<GuestDto>;
        return page;
      }),
      tap(p => {
        this.guestSubject.next(p);
      })
    );
  }

  public findByUnpaged(searchCriteria?: SearchCriteria): Observable<Page<GuestDto>> {
    return this.findBy(undefined, 0, 1000, undefined, searchCriteria);
  }

  public delete(id: number) {
    return from(this.api.invoke(deleteGuest, { id: id }))
      .pipe(
        tap({
          next: (response: any) => this.notification.success(response),
          error: (error) => this.notification.error(error)
        }),
        switchMap(() => this.refreshData())
      );
  }

  public create(g: GuestDto) {
    return from(this.api.invoke(create1, { body: g as unknown as GuestDto }))
      .pipe(
        tap({
          next: (response: any) => this.notification.success(response),
          error: (error) => this.notification.error(error)
        }),
        switchMap(() => this.refreshData())
      );
  }

  public update(g: GuestDto) {
    return from(this.api.invoke(update1, { body: g as unknown as GuestDto }))
      .pipe(
        tap({
          next: (response: any) => this.notification.success(response),
          error: (error) => this.notification.error(error)
        }),
        switchMap(() => this.refreshData())
      );
  }

  private refreshData(): Observable<Page<GuestDto>> {
    const { event, page, size, sort, searchCriteria } = this.lastQueryParams;
    return this.findBy(event, page, size, sort, searchCriteria);
  }

}
