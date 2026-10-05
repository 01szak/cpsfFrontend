import {Injectable, inject} from '@angular/core';
import {CamperPlaceTypeService} from './CamperPlaceTypeService';
import { ResourceType } from "./service-facade.service";
import {AbstractService} from '@core/services/openApiWrappers/AbstractService';

@Injectable({providedIn: "root"})
export class CamperPlaceService extends AbstractService {

  public override getType(): ResourceType {
      return ResourceType.CAMPER_PLACE;
  }

  private typeService = inject(CamperPlaceTypeService);

  // private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  // public refreshed$ = this.refreshTrigger$.asObservable();

  //
  // public camperPlacesForTable$ = merge(
  //   this.refreshed$,
  //   this.typeService.refreshed$
  // ).pipe(
  //   switchMap(() => this.getCamperPlaces()),
  //   shareReplay(1)
  // );


  //
  // getCamperPlacesWithUniquePriceAndCamperTypeId(cptId: number): Observable<CamperPlaceDto[]> {
  //   return from(this.api.invoke(getCamperPlacesWithUniquePriceAndCamperTypeId, { typeId: cptId })) as unknown as Observable<CamperPlaceDto[]>;
  // }

}
