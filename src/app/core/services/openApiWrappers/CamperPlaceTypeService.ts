import {Injectable} from '@angular/core';
import {AbstractService} from '@core/services/openApiWrappers/AbstractService';
import { ResourceType } from "./service-facade.service";

@Injectable({providedIn: "root"})
export class CamperPlaceTypeService extends AbstractService {

  public override getType(): ResourceType {
        return ResourceType.CAMPER_PLACE_TYPE;
    }

}
