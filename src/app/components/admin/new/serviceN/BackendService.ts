import {ReservationN} from '../InterfaceN/ReservationN';
import {PageEvent} from '@angular/material/paginator';
import {Filter, Sort} from '../../regular-table/regular-table.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from '../InterfaceN/Page';
import {BehaviorSubject, map} from 'rxjs';
import {inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {BackendEntities} from '../InterfaceN/BackendEntities';

export class BackendService<T extends BackendEntities> {

  private snackBar = inject(MatSnackBar);
  private formDialog = inject(MatDialog);

  private event?: PageEvent;
  private page?: number;
  private size?: number;
  private sort?: Sort;
  private filter?: Filter;

  protected  backendEntitiesSubjet =  new BehaviorSubject<T>({});

  private successSnackBar (response: {[key: string]: string } ) {
    this.snackBar.open(response['success'], undefined, {
      panelClass: 'successSnackBar',
      duration: 5000,
      horizontalPosition: 'start',
      verticalPosition: 'top'
    });
  }
  private errorSnackBar (error: any) {
    this.snackBar.open(error.error?.message || 'Coś poszło nie tak', undefined, {
      panelClass: 'errorSnackBar',
      duration: 5000,
      horizontalPosition: 'start',
      verticalPosition: 'top'
    });
  }

  constructor(
    private api: string,
    private http: HttpClient) {
  }
  public create(reservation: ReservationN) {
    return this.http.post<{[key: string]: string}>(this.api, reservation).subscribe({
      next: (response) => {
        this.successSnackBar(response);
        this.formDialog.closeAll();
        this.fetchAllData();
      },
      error: (error) => {
        this.error(error);
      }
    });
  }

  public update(r: ReservationN) {
    return this.http.patch<{[key: string]: string}>(this.api + '/' + r.id, r).subscribe({
      next: (response) => {
        this.successSnackBar(response);
        this.formDialog.closeAll();
      },
      error: (error) => {
        this.errorSnackBar(error);
      }
    });
  }

  public delete(reservation: ReservationN): () => void {
    return () => {
      this.http.delete<{[key: string]: string}>(this.api + '/' + reservation.id!.toString()).subscribe({
        next: (response ) => {
          this.successSnackBar(response);
          this.formDialog.closeAll();
        },
        error: (error) => {
          this.errorSnackBar(error);
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
}
