import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {UserN} from './../InterfaceN/UserN';
import {BackendService} from './BackendService';
import {PageEvent} from '@angular/material/paginator';
import {Filter, Sort} from '../../regular-table/regular-table.component';
import {Page} from '../InterfaceN/Page';
import {ReservationN} from '../InterfaceN/ReservationN';

@Injectable({providedIn: "root"})
export class NewUserService extends BackendService<UserN>{

  constructor(http: HttpClient) {
    super(
      '/api/users',
      http,
      new BehaviorSubject<UserN | null>(null))
  }
  public override findAll(event?: PageEvent, page?: number, size?: number, sort?: Sort, filter?: Filter): Observable<Page<UserN>> {
    return super.findAll(event, page, size, sort, filter).pipe(
      tap(p => {
        this.pageDataBs.next(p);
      })
    );
  }

}
