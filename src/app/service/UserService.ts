import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {User} from '../components/Interface/User';
import {BackendService} from './BackendService';
import {PageEvent} from '@angular/material/paginator';
import {Filter, Sort} from '../components/admin/regular-table/regular-table.component';
import {Page} from '../components/Interface/Page';
import {Reservation} from '../components/Interface/Reservation';

@Injectable({providedIn: "root"})
export class UserService extends BackendService<User>{

  constructor(http: HttpClient) {
    super(
      '/api/user',
      http,
      new BehaviorSubject<User | null>(null))
  }
  public override findAll(event?: PageEvent, page?: number, size?: number, sort?: Sort, filter?: Filter): Observable<Page<User>> {
    return super.findAll(event, page, size, sort, filter).pipe(
      tap(p => {
        this.pageDataBs.next(p);
      })
    );
  }

}
