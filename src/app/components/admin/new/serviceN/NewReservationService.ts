import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ReservationMetadata} from './../InterfaceN/ReservationMetadata';
import {ReservationN} from './../InterfaceN/ReservationN';
import {PaidReservations} from './../InterfaceN/PaidReservations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserPerReservation} from './../InterfaceN/UserPerReservation';
import {PageEvent} from '@angular/material/paginator';
import {Page} from '../InterfaceN/Page';
import {ReservationHelper} from './ReservationHelper';
import {Sort} from '../../regular-table/regular-table.component';

@Injectable({providedIn: "root"})
export class NewReservationService {

  readonly api = '/api/reservations/'
  private snackBar = inject(MatSnackBar);

  constructor(private http: HttpClient, private reservationHelper: ReservationHelper) {}

  getReservations(): Observable<ReservationN[]> {
    return this.http.get<ReservationN[]>(this.api + 'getAll');
  }

  getReservationMetadata(): Observable<Record<string, ReservationMetadata>> {
    return this.http.get<Record<string, ReservationMetadata>> (this.api + 'getReservationMetadata');
  }

  getPaidReservations(): Observable<Record<string, PaidReservations>> {
    return this.http.get<Record<string, PaidReservations>> (this.api + 'getPaidReservations');
  }

  getUnPaidReservations(): Observable<Record<string, PaidReservations>> {
    return this.http.get<Record<string, PaidReservations>> (this.api + 'getUnPaidReservations');
  }

  getUserPerReservation(): Observable<UserPerReservation> {
    return this.http.get<UserPerReservation> (this.api + 'getUserPerReservation');
  }

  createReservation(reservation: ReservationN) {
    return this.http.post(this.api + 'createReservation', reservation).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || "Coś poszło nie tak", undefined, {
          panelClass: 'errorSnackBar',
          duration: 5000,
          horizontalPosition: 'start',
          verticalPosition: 'top'
        });
      }
    });
  }

  updateReservation(r: ReservationN){
    r.checkin = this.reservationHelper.formatToStringDate(r.checkin);
    r.checkout = this.reservationHelper.formatToStringDate(r.checkout);
    return this.http.patch(this.api + 'updateReservation/' + r.id, r).subscribe({
      next: () => {
        window.location.reload();
      },
      error:(error) => {
        this.snackBar.open(error.error?.message || "Coś poszło nie tak", undefined, {
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
          this.snackBar.open(error.error?.message || "Coś poszło nie tak", undefined, {
            panelClass: 'errorSnackBar',
            duration: 5000,
            horizontalPosition: 'start',
            verticalPosition: 'top'
          });
        }
      });
    };
  }

  findAll(event?: PageEvent, page?: number, size?: number, sort?: Sort ): Observable<Page<ReservationN>> {
    let params = new HttpParams()
      .set('page', event?.pageIndex || page || 0)
      .set('size', event?.pageSize || size || 0);
      if (sort) {
        params = params.set('sort', sort.columnName + ',' + sort.direction);
      }
console.log(this.api + 'findAll', { params })
    return this.http.get<Page<ReservationN>>(this.api + 'findAll', { params });
  }
}

