import {Injectable} from '@angular/core';
import {AbstractService} from '@core/services/openApiWrappers/AbstractService';
import {ResourceType} from '@core/services/openApiWrappers/service-facade.service';

export type ReservationStatus = 'EXPIRED' | 'ACTIVE' | 'COMING';

@Injectable({providedIn: "root"})
export class ReservationService extends AbstractService {

  public override getType(): ResourceType {
      return ResourceType.RESERVATION;
  }

}
