import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CamperPlace} from '../components/admin/calendar/CamperPlace';

@Injectable({ providedIn: 'root' })
export class ConfigService {

  constructor(private http: HttpClient) {}
    getAllCamperPlaces(): Observable<any[]>{
      return this.http.get<any[]>('http://localhost:8080/camperPlace/findAll');
    }

}
