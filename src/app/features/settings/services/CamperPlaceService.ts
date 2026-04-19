import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, shareReplay, switchMap, tap} from 'rxjs';
import {CamperPlace} from '@core/models/CamperPlace';
import {CamperPlaceForTable} from '@core/models/CamperPlaceForTable';
import {BackendService} from '@core/services/BackendService';

@Injectable({providedIn: "root"})
export class CamperPlaceService extends BackendService<CamperPlaceForTable>{

  private camperPlaceSubject = new BehaviorSubject<CamperPlace[]>([]);
  private camperPlaceForTableSubject = new BehaviorSubject<CamperPlaceForTable[]>([]);

  public camperPlaces$: Observable<CamperPlace[]> = this.camperPlaceSubject.asObservable();

  public camperPlacesForTable$ = this.refreshed$.pipe(
    switchMap(() => this.getCamperPlacesForTable()),
    shareReplay(1)
  );

  constructor(http: HttpClient) {
    super('api/camperPlace', http, new BehaviorSubject<CamperPlaceForTable | null>(null));
  }

  getCamperPlacesForTable(): Observable<CamperPlaceForTable[]> {
    return this.http.get<CamperPlaceForTable[]>(this.api).pipe(
      tap(p => {
        this.camperPlaceForTableSubject.next(p)
      })
    );
  }

  getCamperPlacesWithUniquePriceAndCamperTypeId(cptId: number): Observable<CamperPlaceForTable[]> {
    return this.http.get<CamperPlaceForTable[]>(`${this.api}/${cptId}`);
  }

  getCamperPlacesAsync() {
    this.http.get<CamperPlace[]>(this.api)
      .subscribe(cp => {
        this.camperPlaceSubject.next(cp);
      });
  }
}
