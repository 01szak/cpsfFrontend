import {Injectable, inject} from '@angular/core';
import {BehaviorSubject, from, Observable, merge, shareReplay, switchMap, tap, map} from 'rxjs';
import {CamperPlaceTypeService} from './CamperPlaceTypeService';
import {Api} from '../../../api/api';
import {getCamperPlaces, create2, update2, delete2, getCamperPlacesWithUniquePriceAndCamperTypeId} from '../../../api';
import {CamperPlaceDto} from '../../../api/models/camper-place-dto';
import {NotificationService} from '@core/services/NotificationService';

@Injectable({providedIn: "root"})
export class CamperPlaceService {
  private api = inject(Api);
  private typeService = inject(CamperPlaceTypeService);
  private notification = inject(NotificationService);

  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  public refreshed$ = this.refreshTrigger$.asObservable();

  private camperPlaceSubject = new BehaviorSubject<CamperPlaceDto[]>([]);
  public camperPlaceDtos$ = this.camperPlaceSubject.asObservable();

  public camperPlacesForTable$ = merge(
    this.refreshed$,
    this.typeService.refreshed$
  ).pipe(
    switchMap(() => this.getCamperPlaces()),
    shareReplay(1)
  );

  public notifyChange() {
    this.refreshTrigger$.next();
  }

  getCamperPlaces(): Observable<CamperPlaceDto[]> {
    return from(this.api.invoke(getCamperPlaces)).pipe(
      map(p => p as unknown as CamperPlaceDto[]),
      tap(p => {
        this.camperPlaceSubject.next(p)
      })
    );
  }

  getCamperPlacesWithUniquePriceAndCamperTypeId(cptId: number): Observable<CamperPlaceDto[]> {
    return from(this.api.invoke(getCamperPlacesWithUniquePriceAndCamperTypeId, { typeId: cptId })) as unknown as Observable<CamperPlaceDto[]>;
  }

  getCamperPlacesAsync() {
    from(this.api.invoke(getCamperPlaces))
      .subscribe(cp => {
        this.camperPlaceSubject.next(cp as unknown as CamperPlaceDto[]);
      });
  }

  public create(t: CamperPlaceDto): Observable<any> {
    return from(this.api.invoke(create2, { body: t }))
      .pipe(
        tap({
          next: (response: any) => {
            this.notification.success(response);
            this.notifyChange();
          },
          error: (error) => {
            this.notification.error(error);
          }
        })
      );
  }

  public update(t: CamperPlaceDto | CamperPlaceDto[]): Observable<any> {
    const body = Array.isArray(t) ? t : [t];
    return from(this.api.invoke(update2, { body: body }))
      .pipe(
        tap({
            next: (response: any) => {
              this.notification.success(response);
              this.notifyChange();
            },
            error: (error) => {
              this.notification.error(error);
            }
          }
        )
      );
  }

  public delete(t: CamperPlaceDto): Observable<any> {
    return from(this.api.invoke(delete2, { campPlaceId: Number(t.id!) }))
        .pipe(
          tap({
            next: (response: any) => {
              this.notification.success(response);
              this.notifyChange();
            },
            error: (error) => {
              this.notification.error(error);
            }
          })
        )
  }
}
