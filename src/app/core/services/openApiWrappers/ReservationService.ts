import {computed, inject, Injectable, ResourceRef, signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {AbstractService} from '@core/services/openApiWrappers/AbstractService';
import {ResourceType} from '@core/services/openApiWrappers/service-facade.service';
import {Page} from '@core/models/Page';
import {CamperPlaceService} from '@core/services/openApiWrappers/CamperPlaceService';
import {Pageable, ReservationDto, SearchCriteria, SearchRequest} from '../../../api';

export type ReservationStatus = 'EXPIRED' | 'ACTIVE' | 'COMING';

//dates in the YYYY-MM-DD format, both borders are checked against the reservation's checkin
export interface CheckinRange {
  from: string;
  to: string;
}

@Injectable({providedIn: "root"})
export class ReservationService extends AbstractService {

  private readonly camperPlaceService = inject(CamperPlaceService);

  public override getType(): ResourceType {
      return ResourceType.RESERVATION;
  }

  //undefined means that nobody needs the data yet, the resource stays idle
  public readonly checkinRange = signal<CheckinRange | undefined>(undefined);

  //unpaged reservations in the checkin range, independent from the shared pageable / searchRequest signals
  //so the table or a popup resetting them cannot truncate the calendar's data
  public readonly rangeResource: ResourceRef<Page<any>> = rxResource({
    defaultValue: {content: [], number: 0, size: 0, totalElements: 0, totalPages: 0} as Page<any>,
    params: () => this.checkinRange(),
    stream: ({params}) => this.serviceFacade.findBy(this.getType(), null, {
      searchCriteria: [{key: 'checkin', operation: 'BETWEEN', value: params.from, secondValue: params.to}]
    })
  });

  public readonly unpaidActivePageable = signal<Pageable | undefined | null>(undefined);
  public readonly unpaidActiveSearchRequest = signal<SearchRequest | undefined>(undefined);

  public readonly unpaidActiveReservations: ResourceRef<Page<any>> = rxResource({
    defaultValue: {content: [], number: 0, size: 0, totalElements: 0, totalPages: 0} as Page<any>,
    params: () => ({pageable: this.unpaidActivePageable(), searchRequest: this.unpaidActiveSearchRequest()}),
    stream: ({params}) => {
      const fixedCriteria: SearchCriteria[] = [
        {key: 'reservationStatus', operation: 'EQUALS', value: 'ACTIVE', joinOperator: 'AND'},
        {key: 'paid', operation: 'EQUALS', value: 'false', joinOperator: 'AND'},
      ];
      return this.serviceFacade.findBy(this.getType(), params.pageable, {
        searchCriteria: [...(params.searchRequest?.searchCriteria ?? []), ...fixedCriteria]
      });
    }
  });

  public readonly reservationsInRange = computed(() => this.rangeResource.value().content as ReservationDto[]);

  protected override reloadResources() {
    super.reloadResources();
    this.rangeResource.reload();
    this.unpaidActiveReservations.reload();
    this.camperPlaceService.availableCamperPlacesResource.reload();
  }

}
