import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoginService {



  constructor(private http: HttpClient) {
  }

  login(request: AuthenticatorRequest): Observable<any> {

    return this.http.post<AuthenticatorRequest>('/api/auth/login',request);
  }
}

export interface AuthenticatorRequest {
  email: string;
  password: string;
}

