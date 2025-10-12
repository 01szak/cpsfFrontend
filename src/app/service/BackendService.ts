import {Reservation} from '../components/Interface/Reservation';
import {PageEvent} from '@angular/material/paginator';
import {Filter, Sort} from '../components/admin/regular-table/regular-table.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from '../components/Interface/Page';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {BackendEntity} from '../components/Interface/BackendEntity';

export class BackendService<T extends BackendEntity> {

  protected pageDataBs: BehaviorSubject<Page<T>>;
  private snackBar = inject(MatSnackBar);

  protected formDialog = inject(MatDialog);
  protected event?: PageEvent;
  protected page?: number;
  protected size?: number;
  protected sort?: Sort;
  protected filter?: Filter;

  public pageData$: Observable<Page<T>>;

  protected successSnackBar (response: {[key: string]: string } ) {
    this.snackBar.open(response['success'], undefined, {
      panelClass: 'successSnackBar',
      duration: 5000,
      horizontalPosition: 'start',
      verticalPosition: 'top'
    });
  }
  protected errorSnackBar (error: any) {
    this.snackBar.open(error.error?.message || 'Coś poszło nie tak', undefined, {
      panelClass: 'errorSnackBar',
      duration: 5000,
      horizontalPosition: 'start',
      verticalPosition: 'top'
    });
  }

  constructor(
    protected api: string,
    protected http: HttpClient,
    protected allDataSubject: BehaviorSubject<any | null>
  ) {
    this.pageDataBs = new BehaviorSubject<Page<T>>({content: [], number: 0, size: 0, totalElements: 0, totalPages: 0});
    this.pageData$ = this.pageDataBs.asObservable();
  }

  public create(t: T) {
    return this.http.post<{[key: string]: string}>(this.api, t)
      .pipe(
        tap({
          next: (response) => {
            this.successSnackBar(response);
            this.formDialog.closeAll();
            this.fetchAllData();
          },
          error: (error) => {
            this.errorSnackBar(error);
          }
        })
      );
  }

  public update(t: T) {
    return this.http.patch<{[key: string]: string}>(this.api + '/' + t.id, t)
      .pipe(
        tap({
            next: (response) => {
              this.successSnackBar(response);
              this.formDialog.closeAll();
            },
            error: (error) => {
              this.errorSnackBar(error);
            }
          }
        )
      );
  }

  public delete<T extends BackendEntity>(t: T) {
    return this.http.delete<{[key: string]: string}>(this.api + '/' + t.id!.toString())
        .pipe(
          tap({
            next: (response ) => {
              this.successSnackBar(response);
              this.formDialog.closeAll();
            },
            error: (error) => {
              this.errorSnackBar(error);
            }
          })
        )
  }

  public findAll(event?: PageEvent, page?: number, size?: number, sort?: Sort, filter?: Filter): Observable<Page<T>> {
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
        size === 0 ? size = 10 : size
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

    return this.http.get<Page<T>>(this.api, {params})
  }

  protected fetchAllData(): Observable<any> {
    // @ts-ignore
    return ;
  }
}
