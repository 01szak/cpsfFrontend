import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, from, map, Observable, shareReplay, switchMap, tap} from 'rxjs';
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

  private camperPlaceTypeSubject = new BehaviorSubject<CamperPlaceTypeDto[]>([]);

  public camperPlaceType$ = this.refreshed$.pipe(
    switchMap(() => this.getCamperPlaceTypes()),
    shareReplay(1)
  );

  public notifyChange() {
    this.refreshTrigger$.next();
  }

  getCamperPlaceTypes(): Observable<CamperPlaceTypeDto[]> {
    return from(this.api.invoke(getTypes)).pipe(
      map(p => p as unknown as CamperPlaceTypeDto[]),
      tap(p => {
        this.camperPlaceTypeSubject.next(p)
      })
    );
  }

  public create(t: CamperPlaceTypeDto): Observable<any> {
    return from(this.api.invoke(create3, { body: t }))
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

  public update(t: CamperPlaceTypeDto | CamperPlaceTypeDto[], params?: any[]): Observable<any> {
    const body = Array.isArray(t) ? t : [t];
    return from(this.api.invoke(update3, {
        body: body,
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

  public delete(t: CamperPlaceTypeDto): Observable<any> {
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
