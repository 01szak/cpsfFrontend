import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CamperPlace, CamperPlaceToJSONParser} from '../components/admin/calendar/CamperPlace';

@Injectable({ providedIn: 'root' })
export class CamperPlaceService {
  api = '/api/camperPlace'
  constructor(private http: HttpClient) {}
    getAllCamperPlaces(): Observable<CamperPlace[]>{
      return this.http.get<CamperPlace[]>(this.api  + '/findAll');
    }
    addCamperPlace(camperPlace : CamperPlaceToJSONParser): Observable<CamperPlace>{
    const headers = new HttpHeaders({'Content-Type': 'application/json; charset=UTF-8'});

       return this.http.post<CamperPlace>('http://localhost:8080/camperPlace/create',JSON.stringify(camperPlace), {headers: headers});
    }
    getCamperPlaceTypes(): Observable<string[]>{
      return this.http.get<string[]>('http://localhost:8080/camperPlace/getCamperPlaceTypes');
    }

}
