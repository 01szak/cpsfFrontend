import {Injectable} from '@angular/core';
import {AbstractService} from '@core/services/openApiWrappers/AbstractService';
import {ResourceType} from '@core/services/openApiWrappers/service-facade.service';

export type ReservationStatus = 'EXPIRED' | 'ACTIVE' | 'COMING';

@Injectable({providedIn: "root"})
export class ReservationService extends AbstractService {

  public override getType(): ResourceType {
      return ResourceType.RESERVATION;
  }

  // public findBy(event?: PageEvent, page?: number, size?: number, sort?: Sort, searchCriteria?: SearchCriteria[]): Observable<Page<ReservationDto>> {
  //   this.lastQueryParams = {
  //     event: event,
  //     page: page,
  //     size: size,
  //     sort: sort,
  //     searchCriteria: searchCriteria
  //   }
  //
  //   const pageable = {
  //     page: event ? event.pageIndex : (page || 0),
  //     size: event ? event.pageSize : (size || 10),
  //     sort: sort ? [sort.columnName + ',' + sort.direction] : undefined
  //   };
  //
  //   const unverifiedReservationsSearchCriteria =  {
  //     key: "reservationStatus",
  //     operation: "NOT_EQUALS",
  //     value: 'UNVERIFIED',
  //     joinOperator: "AND"
  //   } as SearchCriteria;
  //
  //   const verifiedReservationsSearchCriteria =  {
  //     key: "reservationStatus",
  //     operation: "NOT_EQUALS",
  //     value: 'VERIFIED',
  //     joinOperator: "AND"
  //   } as SearchCriteria;
  //
  //   if (!searchCriteria) searchCriteria = [];
  //
  //   searchCriteria.push(verifiedReservationsSearchCriteria, unverifiedReservationsSearchCriteria);
  //
  //   const body = {
  //     searchCriteria: searchCriteria
  //   } as SearchRequest
  //
  //   return from(this.api.invoke(findBy, {pageable: pageable, body: body}))
  //     .pipe(
  //       map(p => {
  //         const page = p as unknown as Page<ReservationDto>;
  //         return page;
  //       }),
  //       tap(p => {
  //         this.reservationSubject.next(p);
  //       })
  //     );
  // }

  // public findByUnpaged(searchCriteria?: SearchCriteria[]): Observable<Page<ReservationDto>> {
  //   return this.findBy(undefined, 0, 1000, undefined, searchCriteria);
  // }
  //
  // public deleteReservation(r: ReservationDto) {
  //   return from(this.api.invoke(deleteReservationFn, { id: Number(r.id!) }))
  //     .pipe(
  //       tap({
  //         next: (response: any) => this.notification.success(response),
  //         error: (error) => this.notification.error(error)
  //       }),
  //       switchMap(() => this.refreshData())
  //     );
  // }

  // public create(r: ReservationDto) {
  //   return from(this.api.invoke(create, { body: r as unknown as ReservationDto }))
  //     .pipe(
  //       tap({
  //         next: (response: any) => this.notification.success(response),
  //         error: (error) => this.notification.error(error)
  //       }),
  //       switchMap(() => this.refreshData())
  //     );
  // }
  //
  // public update(r: ReservationDto) {
  //   return from(this.api.invoke(update, { body: r as unknown as ReservationDto }))
  //     .pipe(
  //       tap({
  //         next: (response: any) => this.notification.success(response),
  //         error: (error) => this.notification.error(error)
  //       }),
  //       switchMap(() => this.refreshData())
  //     );
  // }
  //
  // private refreshData(): Observable<Page<ReservationDto>> {
  //   const { event, page, size, sort, searchCriteria } = this.lastQueryParams;
  //   return this.findBy(event, page, size, sort, searchCriteria);
  // }

}
