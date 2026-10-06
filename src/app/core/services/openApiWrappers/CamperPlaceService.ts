import {Injectable, ResourceRef, computed, inject} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {Page} from '@core/models/Page';
import { ResourceType } from "./service-facade.service";
import {AbstractService} from '@core/services/openApiWrappers/AbstractService';
import {Api, CamperPlaceDto, getCamperPlacesWithUniquePriceAndCamperTypeId} from '../../../api';
import {from, Observable} from 'rxjs';

@Injectable({providedIn: "root"})
export class CamperPlaceService extends AbstractService {

  public override getType(): ResourceType {
      return ResourceType.CAMPER_PLACE;
  }

  private readonly api = inject(Api);

  private readonly unpagedCamperPlaceResource: ResourceRef<Page<any>> = rxResource({
    params: () => ({}),
    stream: () => this.serviceFacade.findBy(this.getType(), null, {searchCriteria: []})
  });

  public readonly indexes = computed(() =>
    this.unpagedCamperPlaceResource.value().content.map(c => (c as CamperPlaceDto).index!)
  );

  // camper places of the given type which have their own price (different from the type's default)
  public getCamperPlacesWithUniquePriceAndCamperTypeId(cptId: number): Observable<CamperPlaceDto[]> {
    return from(this.api.invoke(getCamperPlacesWithUniquePriceAndCamperTypeId, {typeId: cptId}));
  }

}
