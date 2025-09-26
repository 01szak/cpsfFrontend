import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {CamperPlaceN} from './../InterfaceN/CamperPlaceN';
import {ReservationN} from '../InterfaceN/ReservationN';

@Injectable({providedIn: "root"})
export class NewCamperPlaceService {

  api = '/api/camperPlaces'

  private camperPlaceSubject = new BehaviorSubject<CamperPlaceN[]>([]);
  public camperPlaces$: Observable<CamperPlaceN[]> = this.camperPlaceSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCamperPlaces(): Observable<CamperPlaceN[]> {
    return this.http.get<CamperPlaceN[]>(this.api);
  }

  getCamperPlacesAsync() {
    this.http.get<CamperPlaceN[]>(this.api)
      .subscribe(cp => {
        this.camperPlaceSubject.next(cp);
      });
  }
}
