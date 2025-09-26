import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Statistic} from './../components/admin/new/InterfaceN/Statistic';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private api = '/api/statistics/';
  constructor(private http: HttpClient) {}

  getRevenue(month: number, year: number): Observable<Statistic[]> {
    return this.http.get<Statistic[]>(
      this.api
      + 'revenue/'
      + year.toString()
      + '/'
      + (month + 1).toString()
    )
  }


  getReservationCount(month: number, year: number): Observable<Statistic[]> {
    return this.http.get<Statistic[]>(
      this.api
      + 'reservationCount/'
      + year.toString()
      + '/'
      + (month + 1).toString()
    )
  }

}
