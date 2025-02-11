import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CamperPlace} from '../components/admin/calendar/CamperPlace';
import {Reservation} from '../components/admin/calendar/Reservation';
import {User} from '../components/admin/calendar/User';

@Injectable({providedIn: 'root'})
export class ReservationService {
  api = '/api/reservations/';

  constructor(private http: HttpClient) {
  }

  getFilteredReservations(value: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.api + 'getFilteredReservations/' + value);
  }

  createReservation(reservation: {
    checkin: string;
    camperPlace: CamperPlace;
    checkout: string;
    user: User
  }): Observable<Reservation> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.post<Reservation>(this.api + 'createReservation', reservation, {headers: headers});
  }


  sortTable(header: string, isAsc: number) {
    return this.http.get<Reservation[]>(this.api + 'sortTable/' + header + "/" + isAsc);
  }

  updateReservation(reservation: {
    id: number
    checkin: string;
    checkout: string;
    camperPlace: CamperPlace;
  }) {
    return this.http.patch<Reservation>(this.api + 'updateReservation/' + reservation.id, reservation);
  }
}
