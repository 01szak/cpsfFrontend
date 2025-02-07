import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CamperPlace} from '../components/admin/calendar/CamperPlace';
import {Reservation} from '../components/admin/calendar/Reservation';
import {User} from '../components/admin/calendar/User';

@Injectable({ providedIn: 'root' })
export class ReservationService{
  api  = '/api/reservations/';
  constructor(private http: HttpClient) {}
  getAllReservations(): Observable<Reservation[]>{
    return this.http.get<Reservation[]>(this.api  + 'findAll');
  }

  createReservation(reservation: {
    checkin: string;
    camperPlace: CamperPlace;
    checkout: string;
    user: User
  }): Observable<Reservation>{
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.post<Reservation>(this.api  + 'createReservation', reservation,{headers: headers});
  }


}
