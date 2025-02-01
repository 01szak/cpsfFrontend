import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoginService {

  api = '/api/auth/';

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {
  }

  login(request: AuthenticatorRequest): Observable<any> {
    return this.http.post<AuthenticatorRequest>(this.api + 'login', request,{headers: this.headers}).pipe(
      tap((response: any) =>{
        if(response.token){
          sessionStorage.setItem('jwtToken',response?.token.toString());
        }
      })
    );
  }
}

export interface AuthenticatorRequest {
  email: string;
  password: string;
}

