import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, merge, shareReplay, switchMap, tap} from 'rxjs';
import {CamperPlace} from '../components/Interface/CamperPlace';
import {CamperPlaceForTable} from '../components/Interface/CamperPlaceForTable';
import {BackendService} from './BackendService';
import {CamperPlaceTypeService} from './CamperPlaceTypeService';

@Injectable({providedIn: "root"})
export class CamperPlaceService extends BackendService<CamperPlaceForTable>{

  private typeService = inject(CamperPlaceTypeService);

  private camperPlaceSubject = new BehaviorSubject<CamperPlace[]>([]);
  private camperPlaceForTableSubject = new BehaviorSubject<CamperPlaceForTable[]>([]);

  public camperPlaces$: Observable<CamperPlace[]> = this.camperPlaceSubject.asObservable();

  // Reaktywny strumień: odświeża się, gdy zmieni się Parcela LUB Typ Parceli
  public camperPlacesForTable$ = merge(
    this.refreshed$,             // Zmiany w parcelach
    this.typeService.refreshed$  // Zmiany w typach (TUTAJ JEST MAGIA)
  ).pipe(
    switchMap(() => this.getCamperPlacesForTable()),
    shareReplay(1)
  );

  constructor(http: HttpClient) {
    super('api/camperPlace', http, new BehaviorSubject<CamperPlaceForTable | null>(null));
  }

  getCamperPlaces(): Observable<CamperPlace[]> {
    return this.http.get<CamperPlace[]>(this.api);
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
