import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CamperPlace} from '../components/admin/calendar/CamperPlace';

@Injectable({providedIn: 'root'})
export class CamperPlaceService {
  api = '/api/camperPlace/';

  constructor(private http: HttpClient) {
  }

  getAllCamperPlaces(): Observable<CamperPlace[]> {
    return this.http.get<CamperPlace[]>(this.api + 'findAll');
  }

  addCamperPlace(camperPlace: CamperPlace): Observable<CamperPlace> {

    const headers = new HttpHeaders({'Content-Type': 'application/json; charset=UTF-8'});

    return this.http.post<CamperPlace>(this.api + 'create', camperPlace, {headers: headers});
  }

  getCamperPlaceTypes(): Observable<string[]> {
    return this.http.get<string[]>(this.api + 'getCamperPlaceTypes');
  }

  deleteCamperPlace(camperPlaceNumber: number) {
    const headers = new HttpHeaders({'Content-Type': 'application/json; charset=UTF-8'});
    return this.http.delete(this.api + 'deleteCamperPlace/' + camperPlaceNumber.toString(), {headers: headers})

  }

  findCamperPlaceByNumber(number: number): Observable<CamperPlace> {
    return this.http.get<CamperPlace>(this.api + 'find/' + number);
  }
}

