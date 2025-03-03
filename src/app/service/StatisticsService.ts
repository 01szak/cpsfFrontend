import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private api = '/api/statistics/';
  private currentMonth = new Date().getMonth() + 1;
  private currentYear = new Date().getFullYear();

  constructor(private http: HttpClient) {
  }

  getMonthlyReservationCount(id: number, month: number, year: number) {
    if (year === 0) {
      year = this.currentYear;
    }
    return this.http.get<number>(this.api + 'getMonthlyReservationCount/' + id + '/' + month + '/' + year)

  }

  getMonthlyRevenue(id: number, month: number, year: number) {

    if (year === 0) {
      year = this.currentYear;
    }
    return this.http.get<number>(this.api + 'getCamperPlaceMonthlyRevenue/' + id + '/' + month + '/' + year)
  }

  getReservationCountForChart(month: number, year: number, camperPlaceId: number[]) {
    if (year === 0) {
      year = this.currentYear;
    }
    return this.http.get<number[]>(this.api + 'getReservationCountForChart/' + month + '/' + year + '/' + camperPlaceId)
  }

  getRevenueForChart(month: number, year: number, camperPlaceId: number[]) {
    if (year === 0) {
      year = this.currentYear;
    }
    return this.http.get<number[]>(this.api + 'getRevenueForChart/' + month + '/' + year + '/' + camperPlaceId)
  }
}
