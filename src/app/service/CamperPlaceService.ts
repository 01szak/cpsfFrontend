import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {CamperPlace} from '../components/Interface/CamperPlace';
import {Reservation} from '../components/Interface/Reservation';

@Injectable({providedIn: "root"})
export class CamperPlaceService {

  api = '/api/camperPlaces'

  private camperPlaceSubject = new BehaviorSubject<CamperPlace[]>([]);
  public camperPlaces$: Observable<CamperPlace[]> = this.camperPlaceSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCamperPlaces(): Observable<CamperPlace[]> {
    return this.http.get<CamperPlace[]>(this.api);
  }

  getCamperPlacesAsync() {
    this.http.get<CamperPlace[]>(this.api)
      .subscribe(cp => {
        this.camperPlaceSubject.next(cp);
      });
  }
}
