import {Injectable, inject} from '@angular/core';
import {Employee} from '@core/models/Employee';
import {BehaviorSubject, from, Observable, tap} from 'rxjs';
import {Api} from '../../api/api';
import {getEmployee} from '../../api/fn/user-controller/get-employee';


@Injectable({providedIn: "root"})
export class EmployeeService {
  private api = inject(Api);

  private employeeBs = new BehaviorSubject<Employee | null>(null);
  public employee$ = this.employeeBs.asObservable();

  public getEmployee(): Observable<Employee> {
    return from(this.api.invoke(getEmployee)).pipe(
      tap(e => {
        this.employeeBs.next(e as Employee);
      })
    ) as unknown as Observable<Employee>;
  }

}
