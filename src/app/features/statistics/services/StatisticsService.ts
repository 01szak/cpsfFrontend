import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {from, Observable} from 'rxjs';
import {Statistic} from '@core/models/Statistic';
import {Revenue} from '@core/models/Revenue';
import {Api} from '../../../api/api';
import {getRevenue} from '../../../api/fn/statistics-controller/get-revenue';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiService = inject(Api);
  private http = inject(HttpClient);
  private api = '/api/statistics/';

  getRevenue(month: number, year: number): Observable<Revenue[][]> {
    return from(this.apiService.invoke(getRevenue, {
        month: month + 1,
        year: year
    })) as unknown as Observable<Revenue[][]>;
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
