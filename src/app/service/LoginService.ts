import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Role} from '../components/Interface/Employee';

@Injectable({providedIn: 'root'})
export class LoginService {

  private readonly api = '/api/auth/';

  private readonly headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  private token: string = '';


  constructor(private http: HttpClient) {
  }

  login(request: AuthenticatorRequest): Observable<any> {
    console.log(this.api + 'login', request,{headers: this.headers})
    return this.http.post<AuthenticatorRequest>(this.api + 'login', request,{headers: this.headers}).pipe(
      tap((response: any) =>{
        if(response){
          this.token = response.token.toString();
          sessionStorage.setItem('jwtToken', this.token);
        }
      })
    );
  }

  public hasRole(role: Role): boolean {
    const r: Role | null = this.getRole();
    if (this.getRole() !== null) {
      return r === role;
    }
    return false
  }

  private getTokenPayload() {
    if (this.token || this.token === '') {
      return null;
    }

    const payload = this.token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  private getRole() {
    const payload = this.getTokenPayload();
    return payload?.scope || null
  }
}


export interface AuthenticatorRequest {
  login: string;
  password: string;
}

