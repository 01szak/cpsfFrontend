import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {CamperPlace} from '../components/Interface/CamperPlace';
import {CamperPlaceType} from '../components/Interface/CamperPlaceType';
import {CamperPlaceForTable} from '../components/Interface/CamperPlaceForTable';

@Injectable({providedIn: "root"})
export class CamperPlaceService {

  api = '/api/camperPlace'


  private camperPlaceSubject = new BehaviorSubject<CamperPlace[]>([]);
  private camperPlaceForTableSubject = new BehaviorSubject<CamperPlaceForTable[]>([]);
  private camperPlaceTypeSubject = new BehaviorSubject<CamperPlaceType[]>([]);

  public camperPlaces$: Observable<CamperPlace[]> = this.camperPlaceSubject.asObservable();
  public camperPlacesForTable$: Observable<CamperPlaceForTable[]> = this.camperPlaceForTableSubject.asObservable();
  public camperPlaceType = this.camperPlaceTypeSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCamperPlaces(): Observable<CamperPlace[]> {
    return this.http.get<CamperPlace[]>(this.api);
  }

  getCamperPlacesForTable(): Observable<CamperPlaceForTable[]> {
    return this.http.get<CamperPlaceForTable[]>(this.api + "/v2").pipe(
      tap(p => {
        this.camperPlaceForTableSubject.next(p)
      })
    );
  }

  getCamperPlaceTypes(): Observable<CamperPlaceType[]> {
    return this.http.get<CamperPlaceType[]>(this.api + "/type").pipe(
      tap(p => {
        this.camperPlaceTypeSubject.next(p)
      })
    );
  }

  getCamperPlacesAsync() {
    this.http.get<CamperPlace[]>(this.api)
      .subscribe(cp => {
        this.camperPlaceSubject.next(cp);
      });
  }
}
