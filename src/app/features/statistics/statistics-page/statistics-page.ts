import {Component, inject, Input, OnInit} from '@angular/core';
import {NewDatePickerComponent} from '@shared/ui/date-picker/new-date-picker.component';
import {StatisticsService} from '@features/statistics/services/StatisticsService';
import {
  StatColumnConfig,
} from '@features/statistics/statistics-page/statistic-panel/statistics-panel.component';
import {forkJoin, take, catchError, of} from 'rxjs';
import {Revenue} from '@core/models/Revenue';
import {RevenueStat} from '@features/statistics/statistics-page/revenue-stat';
import {CommonModule} from '@angular/common';
import {GuestsPerCountryStat} from '@features/statistics/statistics-page/guests-per-country-stat';
import {CountryDistribution} from '../../../api';

@Component({
  selector: 'statistics',
  imports: [
    CommonModule,
    NewDatePickerComponent,
    RevenueStat,
    GuestsPerCountryStat,
  ],
  styles: `
    .datePicker {
      width: 100%;
      display: flex;
      justify-content: start;
      margin-left: 100px;
    }

    app-new-date-picker {
      width: 100%;
    }
    .tablesWrapper {
      display: flex;
      flex-direction: row;
      padding: 20px;
      gap: 50px;
    }
    .stat {
      width: 100%;
    }
  `,
  template: `
    <div class="datePicker">
      <app-new-date-picker (month)="changeMonth($event)" (year)="changeYear($event)"/>
    </div>
    <div class="tablesWrapper">
      <revenue-stat class="stat"
                    [data]="revenueOfPaidReservations"
                    [title]="'Rezerwacje zrealizowane'">
      </revenue-stat>
      <revenue-stat class="stat"
                    [data]="revenueOfUnPaidReservations"
                    [title]="'Rezerwacje nieopłacone'">
      </revenue-stat>
      <guests-per-country-stat class="stat"
                     [data]="guestsPerCountryDistribution"
                     [title]="'Rozkład gości na kraje'">
      </guests-per-country-stat>
    </div>
  `,
  standalone: true
})
export class StatisticsPage implements OnInit {

  @Input() month: number = new Date().getMonth();
  @Input() year: number = new Date().getFullYear();

  private statisticsService = inject(StatisticsService);

  revenueOfPaidReservations: Revenue[] = [];
  revenueOfUnPaidReservations: Revenue[] = [];
  guestsPerCountryDistribution: CountryDistribution[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  changeMonth(event: number) {
    this.month = event;
    this.loadData();
  }

  changeYear(event:number) {
    this.year = event;
    this.loadData();
  }

  loadData() {
    forkJoin({
      revenue: this.statisticsService.getRevenue(this.month, this.year).pipe(
        take(1),
        catchError(() => of([[], []]))
      ),
      countries: this.statisticsService.getUserPerCountry(this.month, this.year).pipe(
        take(1),
        catchError(() => of([]))
      )
    }).subscribe({
      next: ({revenue, countries}) => {
        this.revenueOfPaidReservations = revenue[0] || [];
        this.revenueOfUnPaidReservations = revenue[1] || [];
        this.guestsPerCountryDistribution = countries;
      },
    });
  }

}
