import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CamperPlace} from '../components/admin/calendar/CamperPlace';
import {Reservation} from '../components/admin/calendar/Reservation';
import {User} from '../components/admin/calendar/User';
import {ReservationN} from './../components/admin/new/InterfaceN/ReservationN';

@Injectable({providedIn: 'root'})
export class ReservationService {
  api = '/api/reservations/';

  constructor(private http: HttpClient) {
  }

  getFilteredReservations(value: string): Observable<ReservationN[]> {
    if (value === '') {
      return this.http.get<ReservationN[]>(this.api + 'getFilteredReservations');
    } else {

      return this.http.get<ReservationN[]>(this.api + 'getFilteredReservations/' + value);
    }
  }

  createReservation(reservation: {
    checkin: Date | number | string;
    camperPlace: Date | number | CamperPlace;
    checkout: string;
    user: User
  }): Observable<Reservation> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    return this.http.post<Reservation>(this.api + 'createReservation', reservation, {headers: headers});
  }


  sortTable(header: string, isAsc: number) {
    return this.http.get<ReservationN[]>(this.api + 'sortTable/' + header + '/' + isAsc);
  }

  updateReservation(reservation: {
    id: number
    checkin: string ;
    checkout: string ;
    camperPlace: CamperPlace;
    paid: boolean
  }) {
    return this.http.patch<Reservation>(this.api + 'updateReservation/' + reservation.id, reservation);
  }
  deleteReservation(id:number){
    return this.http.delete(this.api + 'deleteReservation/' + id);
  }
}
