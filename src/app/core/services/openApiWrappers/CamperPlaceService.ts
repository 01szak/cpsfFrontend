import {Injectable, ResourceRef, computed, signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {Page} from '@core/models/Page';
import { ResourceType } from "./service-facade.service";
import {AbstractService} from '@core/services/openApiWrappers/AbstractService';
import {
  CamperPlaceDto,
  getAvailableCamperPlaces, getCamperPlacesWithUniquePriceAndCamperTypeId, Pageable, ReservationDto
} from '../../../api';
import {forkJoin, from, map, Observable} from 'rxjs';

//a single page big enough to hold every camper place, null (unpaged) can not be combined with sorting
const ALL_SORTED_BY_INDEX: Pageable = {page: 0, size: 2147483647, sort: ['index', 'ASC']};

//dates in the YYYY-MM-DD format, a place is available when no reservation overlaps the range
export interface AvailabilityRange {
  from: string;
  to: string;
}

@Injectable({providedIn: "root"})
export class CamperPlaceService extends AbstractService {

  public override getType(): ResourceType {
      return ResourceType.CAMPER_PLACE;
  }

  //independent from the shared pageable / searchRequest signals, so it is not affected by other pages / popups resetting them
  public readonly unpagedCamperPlaceResource: ResourceRef<Page<any>> = rxResource({
    defaultValue: {content: [], number: 0, size: 0, totalElements: 0, totalPages: 0} as Page<any>,
    params: () => ({}),
    stream: () => this.serviceFacade.findBy(this.getType(), ALL_SORTED_BY_INDEX, {searchCriteria: []})
  });

  //undefined means that nobody needs the data yet, the resource stays idle
  public readonly availabilityRange = signal<AvailabilityRange | undefined>(undefined);

  //camper places without any reservation overlapping the availability range (checkin < to && checkout > from),
  //there is no dedicated endpoint so it is computed from the unpaged camper places and the overlapping reservations
  public readonly availableCamperPlacesResource: ResourceRef<CamperPlaceDto[]> = rxResource({
    defaultValue: [] as CamperPlaceDto[],
    params: () => this.availabilityRange(),
    stream: ({params}) => from(this.serviceFacade.api.invoke(getAvailableCamperPlaces, params))
  });

  public readonly camperPlaces = computed(() => this.unpagedCamperPlaceResource.value().content as CamperPlaceDto[]);

  public readonly indexes = computed(() => this.camperPlaces().map(c => c.index!));

  protected override reloadResources() {
    super.reloadResources();
    this.unpagedCamperPlaceResource.reload();
    this.availableCamperPlacesResource.reload();
  }

  // camper places of the given type which have their own price (different from the type's default)
  public getCamperPlacesWithUniquePriceAndCamperTypeId(cptId: number): Observable<CamperPlaceDto[]> {
    return from(this.serviceFacade.api.invoke(getCamperPlacesWithUniquePriceAndCamperTypeId, {typeId: cptId}));
  }

}
