import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ReservationMetadata} from './../InterfaceN/ReservationMetadata';
import {ReservationN} from './../InterfaceN/ReservationN';
import {PaidReservations} from './../InterfaceN/PaidReservations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackBarComponent} from './../snack-bar/snack-bar.component';

@Injectable({providedIn: "root"})
export class NewReservationService {

  readonly api = '/api/reservations/'
  private snackBar = inject(MatSnackBar);

  constructor(private http: HttpClient) {}

  getReservations(): Observable<ReservationN[]> {
    return this.http.get<ReservationN[]>(this.api + 'getAll');
  }

  getReservationMetadata(): Observable<Record<string, ReservationMetadata>> {
    return this.http.get<Record<string, ReservationMetadata>> (this.api + 'getReservationMetadata');
  }

  getPaidReservations(): Observable<Record<string, PaidReservations>> {
    return this.http.get<Record<string, PaidReservations>> (this.api + 'getPaidReservations');
  }

  createReservation(reservation: ReservationN) {
    return this.http.post<ReservationN>(this.api + 'createReservation', reservation).subscribe({
      next: () => {
        window.location.reload();
      },
      error:(error) => {
        this.snackBar.open(error.error?.message || "Unexpected error", undefined, {
          panelClass: 'errorSnackBar',
          duration: 5000,
          horizontalPosition: 'start',
          verticalPosition: 'top'
        });
      }
      }
    );
  }

  updateReservation(reservationToUpdate: ReservationN){
    return this.http.patch<ReservationN>(this.api + 'updateReservation/' + reservationToUpdate.id!.toString(), reservationToUpdate).subscribe( {
      next: () => {
        window.location.reload();
      },
      error:(error) => {
        this.snackBar.open(error.error?.message || "Unexpected error", undefined, {
          panelClass: 'errorSnackBar',
          duration: 5000,
          horizontalPosition: 'start',
          verticalPosition: 'top'
        });
      }
    });
  }

  deleteReservation(reservation: ReservationN): () => void {
    return () => {
      this.http.delete(this.api + 'deleteReservation/' + reservation.id!.toString()).subscribe( {
        next: () => {
          window.location.reload();
        },
        error:(error) => {
          this.snackBar.open(error.error?.message || "Unexpected error", undefined, {
            panelClass: 'errorSnackBar',
            duration: 5000,
            horizontalPosition: 'start',
            verticalPosition: 'top'
          });
        }
      });
    };
  }

}
