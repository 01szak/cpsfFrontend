import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CamperPlace} from '../components/admin/calendar/CamperPlace';
import {Reservation} from '../components/admin/calendar/Reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService{
  api  = '/api/reservations/';
  constructor(private http: HttpClient) {}
  getAllReservations(): Observable<Reservation[]>{
    return this.http.get<Reservation[]>(this.api  + 'findAll');
  }


}
