import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CamperPlaceN} from './../InterfaceN/CamperPlaceN';

@Injectable({providedIn: "root"})
export class NewCamperPlaceService {

  api = '/api/camperPlace/'

  constructor(private http: HttpClient) {}

  getCamperPlaces(): Observable<CamperPlaceN[]> {
    return this.http.get<CamperPlaceN[]>(this.api + 'getAll');
  }
}
