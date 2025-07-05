import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserN} from './../InterfaceN/UserN';

@Injectable({providedIn: "root"})
export class NewUserService {

  readonly api = '/api/users/'

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<UserN[]> {
    return this.http.get<UserN[]>(this.api + 'getAll');
  }
}
