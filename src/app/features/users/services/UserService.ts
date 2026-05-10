// DDD Refactored
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {Guest} from '@core/models/Guest';
import {BackendService} from '@core/services/BackendService';
import {PageEvent} from '@angular/material/paginator';
import {Filter, Sort} from '@shared/ui/data-table/regular-table.component';
import {Page} from '@core/models/Page';
import {Reservation} from '@core/models/Reservation';

@Injectable({providedIn: "root"})
export class UserService extends BackendService<Guest>{

  constructor(http: HttpClient) {
    super(
      '/api/guest',
      http,
      new BehaviorSubject<Guest | null>(null))
  }
  public override findAll(event?: PageEvent, page?: number, size?: number, sort?: Sort, filter?: Filter): Observable<Page<Guest>> {
    return super.findAll(event, page, size, sort, filter).pipe(
      tap(p => {
        this.pageDataBs.next(p);
      })
    );
  }

}
