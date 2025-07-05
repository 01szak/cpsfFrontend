import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ReservationMetadata} from './../InterfaceN/ReservationMetadata';
import {ReservationN} from './../InterfaceN/ReservationN';

@Injectable({providedIn: "root"})
export class NewReservationService {

  readonly api = '/api/reservations/'

  constructor(private http: HttpClient) {}

  getReservations(): Observable<ReservationN[]> {
    return this.http.get<ReservationN[]>(this.api + 'getAll');
  }

  getReservationMetadata(): Observable<Record<string, ReservationMetadata>> {
    return this.http.get<Record<string, ReservationMetadata>> (this.api + 'getReservationMetadata');
  }

  createReservation(reservation: ReservationN) {
    return this.http.post<ReservationN>(this.api + 'createReservation', reservation).subscribe(() => {
        window.location.reload();
      }
    );
  }

  updateReservation(reservationToUpdate: ReservationN){
    return this.http.patch<ReservationN>(this.api + 'updateReservation/' + reservationToUpdate.id!.toString(), reservationToUpdate).subscribe(() => {
      window.location.reload();
    });
  }

  deleteReservation(reservation: ReservationN): () => void {
    return () => {
      this.http.delete(this.api + 'deleteReservation/' + reservation.id!.toString()).subscribe(() => {
        window.location.reload();
      });
    };
  }

}
