// DDD Refactored
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, from, map, Observable, shareReplay, switchMap, tap} from 'rxjs';
import {CamperPlaceType} from '@core/models/CamperPlaceType';
import {Api} from '../../../api/api';
import {getTypes, create3, update3, delete1} from '../../../api';
import {CamperPlaceTypeDto} from '../../../api/models/camper-place-type-dto';
import {NotificationService} from '@core/services/NotificationService';

@Injectable({providedIn: "root"})
export class CamperPlaceTypeService {
  private api = inject(Api);
  private notification = inject(NotificationService);

  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  public refreshed$ = this.refreshTrigger$.asObservable();

  private camperPlaceTypeSubject = new BehaviorSubject<CamperPlaceType[]>([]);

  public camperPlaceType$ = this.refreshed$.pipe(
    switchMap(() => this.getCamperPlaceTypes()),
    shareReplay(1)
  );

  public notifyChange() {
    this.refreshTrigger$.next();
  }

  getCamperPlaceTypes(): Observable<CamperPlaceType[]> {
    return from(this.api.invoke(getTypes)).pipe(
      map(p => p as unknown as CamperPlaceType[]),
      tap(p => {
        this.camperPlaceTypeSubject.next(p)
      })
    );
  }

  public create(t: CamperPlaceType): Observable<any> {
    return from(this.api.invoke(create3, { body: t as CamperPlaceTypeDto }))
      .pipe(
        tap({
          next: (response: any) => {
            this.notification.success(response);
            this.notifyChange();
          },
          error: (error) => this.notification.error(error)
        })
      );
  }

  public update(t: CamperPlaceType | CamperPlaceType[], params?: any[]): Observable<any> {
    const body = Array.isArray(t) ? t : [t];
    return from(this.api.invoke(update3, {
        body: body as CamperPlaceTypeDto[],
        cpIdToOverride: params
    }))
      .pipe(
        tap({
            next: (response: any) => {
              this.notification.success(response);
              this.notifyChange();
            },
            error: (error) => this.notification.error(error)
          }
        )
      );
  }

  public delete(t: CamperPlaceType): Observable<any> {
    return from(this.api.invoke(delete1, { cpTypeId: Number(t.id!) }))
        .pipe(
          tap({
            next: (response: any) => {
              this.notification.success(response);
              this.notifyChange();
            },
            error: (error) => this.notification.error(error)
          })
        )
  }

}
