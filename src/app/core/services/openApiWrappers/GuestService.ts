import {inject, Injectable, ResourceRef, signal} from '@angular/core';
import {BehaviorSubject, from, map, tap} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {Page} from '@core/models/Page';
import {DtoDisplayDataMap, Sort} from '@shared/ui/data-table/regular-table.component';
import {COUNTRIES} from '@shared/constants/COUNTRIES';
import {Api, Pageable} from '../../../api';
import {GuestDto} from '../../../api';
import {SearchCriteria} from '../../../api';
import {NotificationService} from '@core/services/NotificationService';
import {create1, deleteGuest, findBy1, SearchRequest, update1} from '../../../api';
import {DataFetchFacade, ResourceType} from '@core/services/openApiWrappers/DataFetchFacade';
import {rxResource} from '@angular/core/rxjs-interop';

@Injectable({providedIn: "root"})
export abstract class AbstractService {
  private readonly dataFetchFacade = inject(DataFetchFacade);
  public readonly pageable = signal<Pageable | undefined>(undefined);
  public readonly searchCriteria = signal<SearchRequest | undefined>(undefined);

  public abstract getType(): ResourceType;

  public pageResource: ResourceRef<Page<any>> = rxResource({
    defaultValue: {content: [], number: 0, size: 0, totalElements: 0, totalPages: 0} as Page<any>,
    params: () => {return {pageable: this.pageable(), searchCriteria: this.searchCriteria()}},
    stream: ({params}) => {
      return this.dataFetchFacade.findByBasedOnType(this.getType(), params.pageable, params.searchCriteria)
    }
  })

}

interface DisplayData {
  content: any,
  totalElements: number
}

export interface DataService {
  getDisplayData(): DisplayData[];
}

// TODO meaby there is a way to have one facade for all dtos? eventually override if needed
@Injectable({providedIn: "root"})
export class GuestService extends AbstractService implements DataService {

  public getDisplayData(): DisplayData[] {
    return this.pageResource.value().content.map(c => c as DisplayData);
  }

  public override getType(): ResourceType {
      return "GUEST" as ResourceType;
  }
  private api = inject(Api);
  private notification = inject(NotificationService);

  private guestSubject = new BehaviorSubject<Page<GuestDto>>({content: [], number: 0, size: 0, totalElements: 0, totalPages: 0});
  public guestDtos$ = this.guestSubject.asObservable();

  private lastQueryParams: {
    event?: PageEvent,
    page?: number,
    size?: number,
    sort?: Sort,
    searchCriteria?: SearchCriteria[]
  } = {};
  //
  // public readonly pageable = signal<Pageable | undefined>(undefined);
  // public readonly searchCriteria = signal<SearchRequest | undefined>(undefined);
  //
  // public guestDtoPage = rxResource({
  //   params: () => {
  //     const pageable = this.pageable();
  //     const searchRequest = this.searchCriteria();
  //     return pageable && searchRequest ? {pageable, searchRequest} : undefined;
  //   },
  //   stream: ({params}) =>
  //     this.dataFetchFacade.findByBasedOnType(ResourceType.GUEST, params.pageable, params.searchRequest).pipe(
  //       map((p: Page<GuestDto>): Page<DtoDisplayDataMap> => ({
  //         ...p,
  //         content: p.content.map(dto => ({dto, displayData: this.toDisplayData(dto)}))
  //       }))
  //     )
  // });

  private toDisplayData(dto: GuestDto) {
    return {
      carRegistration: dto.carRegistration || '',
      email: dto.email || '',
      firstname: dto.firstname || '',
      lastname: dto.lastname || '',
      phoneNumber: dto.phoneNumber || '',
      country: COUNTRIES.find(c => c.isoCode.toLowerCase() === (dto.country?.toLowerCase() || ''))?.name || '',
    };
  }

  public findBy(event?: PageEvent, page?: number, size?: number, sort?: Sort, searchCriteria?: SearchCriteria[]): void {
    this.lastQueryParams = {event, page, size, sort, searchCriteria};

    this.pageable.set({
      page: event ? event.pageIndex : (page || 0),
      size: event ? event.pageSize : (size || 10),
      sort: sort ? [sort.columnName + ',' + sort.direction] : undefined
    });
    this.searchCriteria.set({searchCriteria: searchCriteria || []} as SearchRequest);
  }

  public findByUnpaged(searchCriteria?: SearchCriteria[]): void {
    this.findBy(undefined, 0, 1000, undefined, searchCriteria);
  // }
  //
  // public delete(id: number) {
  //   return from(this.api.invoke(deleteGuest, { id: id }))
  //     .pipe(
  //       tap({
  //         next: (response: any) => this.notification.success(response),
  //         error: (error) => this.notification.error(error)
  //       }),
  //       tap(() => this.guestDtoPage.reload())
  //     );
  // }
  //
  // public create(g: GuestDto) {
  //   return from(this.api.invoke(create1, { body: g as unknown as GuestDto }))
  //     .pipe(
  //       tap({
  //         next: (response: any) => this.notification.success(response),
  //         error: (error) => this.notification.error(error)
  //       }),
  //       tap(() => this.guestDtoPage.reload())
  //     );
  // }
  //
  // public update(g: GuestDto) {
  //   return from(this.api.invoke(update1, { body: g as unknown as GuestDto }))
  //     .pipe(
  //       tap({
  //         next: (response: any) => this.notification.success(response),
  //         error: (error) => this.notification.error(error)
  //       }),
  //       tap(() => this.guestDtoPage.reload())
  //     );
  // }
}}
