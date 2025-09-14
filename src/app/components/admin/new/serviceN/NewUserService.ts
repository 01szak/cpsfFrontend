import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserN} from './../InterfaceN/UserN';
import {PageEvent} from '@angular/material/paginator';
import {Page} from '../InterfaceN/Page';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Filter, Sort} from '../../regular-table/regular-table.component';

@Injectable({providedIn: "root"})
export class NewUserService {

  readonly api = '/api/users/'
  private snackBar = inject(MatSnackBar);

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<UserN[]> {
    return this.http.get<UserN[]>(this.api + 'getAll');
  }

  findAll(event?: PageEvent, page?: number, size?: number, sort?: Sort, filter?: Filter): Observable<Page<UserN>> {
    let params = new HttpParams()
      .set('page', event?.pageIndex || page || 0)
      .set('size', event?.pageSize || size || 0);

    if (sort) {
      params = params.set('sort', sort.columnName + ',' + sort.direction);
    }
    if (filter) {
      params = params
        .set('by', filter.by)
        .set('value', filter.value);
    }

    return this.http.get<Page<UserN>>(this.api, { params });
  }

  create(user: UserN) {
    return this.http.post(this.api + 'create', user).subscribe({
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
  update(user: UserN) {
    return this.http.patch(this.api + 'update/' + user.id, user).subscribe({
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
  delete(user: UserN): () => void {
    return () => {
      this.http.delete(this.api + 'delete/' + user.id!.toString()).subscribe( {
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
}
