import {Injectable} from '@angular/core';
import {BackendService} from './BackendService';
import {Employee} from '../components/Interface/Employee';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';


@Injectable({providedIn: "root"})
export class EmployeeService extends BackendService<Employee> {

  public employee$: Observable<Employee>;

  constructor(
    http: HttpClient,
  ) {
    super(
      '/api/employee',
      http,
      new BehaviorSubject<Employee | null>(null)
    );
    this.employee$ = this.allDataSubject.asObservable();
  }

  public getEmployee() {
    return this.http.get<Employee>(this.api).pipe(
      tap(e => {
        this.allDataSubject.next(e);
      })
    );
  }

}
