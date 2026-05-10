import {Injectable, inject} from '@angular/core';
import {BehaviorSubject, from, Observable, merge, shareReplay, switchMap, tap, map} from 'rxjs';
import {CamperPlace} from '@core/models/CamperPlace';
import {CamperPlaceForTable} from '@core/models/CamperPlaceForTable';
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

  private camperPlaceSubject = new BehaviorSubject<CamperPlace[]>([]);
  private camperPlaceForTableSubject = new BehaviorSubject<CamperPlaceForTable[]>([]);

  public camperPlaces$: Observable<CamperPlace[]> = this.camperPlaceSubject.asObservable();

  public camperPlacesForTable$ = merge(
    this.refreshed$,
    this.typeService.refreshed$
  ).pipe(
    switchMap(() => this.getCamperPlacesForTable()),
    shareReplay(1)
  );

  public notifyChange() {
    this.refreshTrigger$.next();
  }

  getCamperPlaces(): Observable<CamperPlace[]> {
    return from(this.api.invoke(getCamperPlaces)).pipe(
        map(cp => cp as unknown as CamperPlace[]),
        tap(cp => this.camperPlaceSubject.next(cp))
    );
  }

  getCamperPlacesForTable(): Observable<CamperPlaceForTable[]> {
    return from(this.api.invoke(getCamperPlaces)).pipe(
      map(p => p as unknown as CamperPlaceForTable[]),
      tap(p => {
        this.camperPlaceForTableSubject.next(p)
      })
    );
  }

  getCamperPlacesWithUniquePriceAndCamperTypeId(cptId: number): Observable<CamperPlaceForTable[]> {
    return from(this.api.invoke(getCamperPlacesWithUniquePriceAndCamperTypeId, { typeId: cptId })) as unknown as Observable<CamperPlaceForTable[]>;
  }

  getCamperPlacesAsync() {
    from(this.api.invoke(getCamperPlaces))
      .subscribe(cp => {
        this.camperPlaceSubject.next(cp as unknown as CamperPlace[]);
      });
  }

  public create(t: CamperPlaceForTable): Observable<any> {
    return from(this.api.invoke(create2, { body: t as unknown as CamperPlaceDto }))
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

  public update(t: CamperPlaceForTable | CamperPlaceForTable[]): Observable<any> {
    const body = Array.isArray(t) ? t : [t];
    return from(this.api.invoke(update2, { body: body as unknown as CamperPlaceDto[] }))
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

  public delete(t: CamperPlaceForTable): Observable<any> {
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
