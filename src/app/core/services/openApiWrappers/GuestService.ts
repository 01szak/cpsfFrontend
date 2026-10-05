import {inject, Injectable, ResourceRef, signal} from '@angular/core';
import {BehaviorSubject, from, map, tap} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {Page} from '@core/models/Page';
import {DtoDisplayDataMap, Sort} from '@shared/ui/data-table/regular-table.component';
import {COUNTRIES} from '@shared/constants/COUNTRIES';
import {Api, CamperPlaceDto, CamperPlaceTypeDto, Pageable, ReservationDto} from '../../../api';
import {GuestDto} from '../../../api';
import {SearchCriteria} from '../../../api';
import {NotificationService} from '@core/services/NotificationService';
import {create1, deleteGuest, findBy1, SearchRequest, update1} from '../../../api';
import {ApiResponse, ServiceFacade, ResourceType} from '@core/services/openApiWrappers/service-facade.service';
import {rxResource} from '@angular/core/rxjs-interop';

@Injectable({providedIn: "root"})
export abstract class AbstractService {
  private readonly serviceFacade = inject(ServiceFacade);
  private readonly notification = inject(NotificationService);
  public readonly pageable = signal<Pageable | undefined>(undefined);
  public readonly searchCriteria = signal<SearchRequest | undefined>(undefined);

  public abstract getType(): ResourceType;

  public pageResource: ResourceRef<Page<any>> = rxResource({
    defaultValue: {content: [], number: 0, size: 0, totalElements: 0, totalPages: 0} as Page<any>,
    params: () => {return {pageable: this.pageable(), searchCriteria: this.searchCriteria()}},
    stream: ({params}) => {
      return this.serviceFacade.findBy(this.getType(), params.pageable, params.searchCriteria)
    }
  })

  public create(body: GuestDto | ReservationDto | CamperPlaceDto | CamperPlaceTypeDto) {
    return this.serviceFacade.create(this.getType(), body).pipe(this.notifyAndReload());
  }

  public update(body: GuestDto | ReservationDto | CamperPlaceDto | CamperPlaceTypeDto | CamperPlaceDto[] | CamperPlaceTypeDto[], cpIdToOverride?: number[]) {
    return this.serviceFacade.update(this.getType(), body, cpIdToOverride).pipe(this.notifyAndReload());
  }

  public delete(id: number) {
    return this.serviceFacade.delete(this.getType(), id).pipe(this.notifyAndReload());
  }

  private notifyAndReload() {
    return tap<ApiResponse>({
      next: (response) => {
        this.notification.success(response);
        this.pageResource.reload();
      },
      error: (error) => this.notification.error(error)
    });
  }
}

@Injectable({providedIn: "root"})
export class GuestService extends AbstractService {

  public override getType(): ResourceType {
    return "GUEST" as ResourceType;
  }

}
