import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CamperPlace} from '../components/admin/calendar/CamperPlace';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  constructor(private http: HttpClient) {}
    getAllCamperPlaces(): Observable<CamperPlace[]>{
      return this.http.get<CamperPlace[]>('http://localhost:8080/camperPlace/findAll');
    }

}
