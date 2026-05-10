import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Statistic} from '@core/models/Statistic';
import {Revenue} from '@core/models/Revenue';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private api = '/api/statistics/';
  constructor(private http: HttpClient) {}

  getRevenue(month: number, year: number): Observable<Revenue[][]> {
    return this.http.get<Revenue[][]>(
      this.api
      + 'revenue/'
      + (month + 1)
      + '/'
      + year
    )
  }


  getReservationCount(month: number, year: number): Observable<Statistic[]> {
    return this.http.get<Statistic[]>(
      this.api
      + 'reservationCount/'
      + (month + 1)
      + '/'
      + year
    )
  }

}
