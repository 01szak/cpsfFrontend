import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {ReservationMetadata} from './../InterfaceN/ReservationMetadata';
import {ReservationN} from './../InterfaceN/ReservationN';
import {PaidReservations} from './../InterfaceN/PaidReservations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserPerReservation} from './../InterfaceN/UserPerReservation';
import {PageEvent} from '@angular/material/paginator';
import {Page} from '../InterfaceN/Page';
import {ReservationHelper} from './ReservationHelper';
import {Filter, Sort} from '../../regular-table/regular-table.component';
import {MatDialog} from '@angular/material/dialog';
import {NewCamperPlaceService} from './NewCamperPlaceService';

@Injectable({providedIn: "root"})
export class NewReservationService {

  readonly api = '/api/reservations'

  private reservationsSubject = new BehaviorSubject<ReservationN[]>([]);
  public reservations$: Observable<ReservationN[]> = this.reservationsSubject.asObservable();

  private reservationsMetadataSubject = new BehaviorSubject<Record<string, ReservationMetadata>>({});
  public reservationsMetadata$: Observable<Record<string, ReservationMetadata>> = this.reservationsMetadataSubject.asObservable();

  private paidReservationsSubject = new BehaviorSubject<Record<string, PaidReservations>>({});
  public paidReservations$: Observable<Record<string, PaidReservations>> = this.paidReservationsSubject.asObservable();

  private unPaidReservationsSubject = new BehaviorSubject<Record<string, PaidReservations>>({});
  public unPaidReservations$: Observable<Record<string, PaidReservations>> = this.unPaidReservationsSubject.asObservable();

  private userPerReservationsSubject = new BehaviorSubject<UserPerReservation>({});
  public userPerReservations$: Observable<UserPerReservation> = this.userPerReservationsSubject.asObservable();

  private snackBar = inject(MatSnackBar);
  private formDialog = inject(MatDialog);

  private event?: PageEvent;
  private page?: number;
  private size?: number;
  private sort?: Sort;
  private filter?: Filter;

  private success (response: {[key: string]: string } ) {
    this.snackBar.open(response['success'], undefined, {
      panelClass: 'successSnackBar',
      duration: 5000,
      horizontalPosition: 'start',
      verticalPosition: 'top'
    });
  }
  private error (error: any) {
    this.snackBar.open(error.error?.message || 'Coś poszło nie tak', undefined, {
      panelClass: 'errorSnackBar',
      duration: 5000,
      horizontalPosition: 'start',
      verticalPosition: 'top'
    });
  }

  constructor(
    private http: HttpClient,
    private reservationHelper: ReservationHelper,
    private camperPlaceService: NewCamperPlaceService) {
  }

  public getReservationMetadata() {
    this.http.get<Record<string, ReservationMetadata>>(this.api + '/getReservationMetadata')
      .subscribe(r => {
        this.reservationsMetadataSubject.next(r);
      });
  }

  public getPaidReservations() {
   this.http.get<Record<string, PaidReservations>>(this.api + '/getPaidReservations')
      .subscribe(r => {
          this.paidReservationsSubject.next(r);
        });
  }

  public getUnPaidReservations() {
     this.http.get<Record<string, PaidReservations>>(this.api + '/getUnPaidReservations')
       .subscribe(r => {
         this.unPaidReservationsSubject.next(r);
       });
  }


  public getUserPerReservation() {
     this.http.get<UserPerReservation>(this.api + '/getUserPerReservation')
       .subscribe(r => {
         this.userPerReservationsSubject.next(r);
       });
  }

  public createReservation(reservation: ReservationN) {
    return this.http.post<{[key: string]: string}>(this.api, reservation).subscribe({
      next: (response) => {
        this.success(response);
        this.formDialog.closeAll();
        this.fetchAllData();
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  public updateReservation(r: ReservationN) {
    r.checkin = this.reservationHelper.formatToStringDate(r.checkin);
    r.checkout = this.reservationHelper.formatToStringDate(r.checkout);
    return this.http.patch<{[key: string]: string}>(this.api + '/' + r.id, r).subscribe({
      next: (response) => {
        this.success(response);
        this.formDialog.closeAll();
        this.fetchAllData();
      },
      error: (error) => {
      this.error(error);
      }
    });
  }

  public deleteReservation(reservation: ReservationN): () => void {
    return () => {
      this.http.delete<{[key: string]: string}>(this.api + '/' + reservation.id!.toString()).subscribe({
        next: (response ) => {
          this.success(response);
          this.formDialog.closeAll();
          const current = this.reservationsSubject.value;
          this.reservationsSubject.next(
            current.filter(r => r.id !== reservation.id)
          );
          this.fetchAllData();
        },
        error: (error) => {
          this.error(error);
        }
      });
    };
  }

  public findAll(event?: PageEvent, page?: number, size?: number, sort?: Sort, filter?: Filter) {
    this.event = event;
    this.page = page;
    this.size = size;
    this.sort = sort;
    this.filter = filter;

    let params = new HttpParams();
    if (event) {
      params = params
        .set('page', event.pageIndex)
        .set('size', event.pageSize);
    } else {
      if (page !== undefined) {
        params = params.set('page', page);
      }
      if (size !== undefined) {
        params = params.set('size', size);
      }
    }
    if (sort) {
      let columnName = sort.columnName;
      if (columnName === 'stringUser') {
        columnName = 'user';
      }
      params = params.set('sort', columnName + ',' + sort.direction);
    }
    if (filter) {
      params = params
        .set('by', filter.by)
        .set('value', filter.value);
    }
    this.http.get<Page<ReservationN>>(this.api, {params})
      .pipe(map(p => {
        const reservations = p.content
        reservations.forEach(r => {
           r.stringUser = r.user?.firstName + " " + r.user?.lastName  || '';
        })
        return p;
      }))
      .subscribe(r => {

      this.reservationsSubject.next(r.content)
    })
  }
  private fetchAllData() {
    this.findAll(
      this.event,
      this.page,
      this.size,
      this.sort,
      this.filter
    )
    this.getReservationMetadata();
    this.getPaidReservations();
    this.getUnPaidReservations();
    this.getUserPerReservation();
    this.camperPlaceService.getCamperPlacesAsync();
  }
}
