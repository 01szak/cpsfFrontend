import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Role} from '@core/models/Employee';

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
    return this.getRole() === role && role !== null;
  }

  private getTokenPayload() {
    if (!this.token) return null;
    try {
      const payload = this.token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  private getRole():Role {
    const payload = this.getTokenPayload();
    return payload?.scope || null
  }
}

export interface AuthenticatorRequest {
  login: string;
  password: string;
}

