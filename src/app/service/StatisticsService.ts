import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Statistic} from '../components/Interface/Statistic';
import {Revenue} from '../components/admin/page/statistics-page/statistics-page';

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
