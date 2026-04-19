import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, shareReplay, switchMap, tap} from 'rxjs';
import {BackendService} from '@core/services/BackendService';
import {CamperPlaceType} from '@core/models/CamperPlaceType';

@Injectable({providedIn: "root"})
export class CamperPlaceTypeService extends BackendService<CamperPlaceType> {

  private camperPlaceTypeSubject = new BehaviorSubject<CamperPlaceType[]>([]);

  public camperPlaceType$ = this.refreshed$.pipe(
    switchMap(() => this.getCamperPlaceTypes()),
    shareReplay(1)
  );

  constructor(http: HttpClient) {
    super('api/camperPlaceType', http, new BehaviorSubject<CamperPlaceType | null>(null));
  }

  getCamperPlaceTypes(): Observable<CamperPlaceType[]> {
    return this.http.get<CamperPlaceType[]>(this.api).pipe(
      tap(p => {
        this.camperPlaceTypeSubject.next(p)
      })
    );
  }

}
