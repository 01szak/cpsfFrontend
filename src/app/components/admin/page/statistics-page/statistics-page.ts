import {Component, Input, OnInit} from '@angular/core';
import {NewDatePickerComponent} from '../../date-picker/new-date-picker.component';
import {StatisticsService} from '../../../../service/StatisticsService';
import {StatisticTableComponent} from './statistic-table/statistic-table.component';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {forkJoin, take, catchError, of} from 'rxjs';

export type Revenue = {
  cpIndex: string,
  count: number,
  revenue: number
}

@Component({
  selector: 'statistics',
  imports: [
    NewDatePickerComponent,
    StatisticTableComponent,
    MatGridList,
    MatGridTile,
  ],
  templateUrl: './statistics-page.html',
  styleUrl: './statistics-page.css',
  standalone: true
})
export class StatisticsPage implements OnInit {

  @Input() month: number = new Date().getMonth();
  @Input() year: number = new Date().getFullYear();

  revenueOfPaidReservations: Revenue[] = [];
  revenueOfUnPaidReservations: Revenue[] = [];

  constructor(
    private statisticsService: StatisticsService
  ) {}

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
    }).subscribe({
      next: ({revenue}) => {
        this.revenueOfPaidReservations = revenue[0] || [];
        this.revenueOfUnPaidReservations = revenue[1] || [];
        console.log('Statistics loaded:', { paid: this.revenueOfPaidReservations, unpaid: this.revenueOfUnPaidReservations });
      },
      error: (err) => console.error('Error loading statistics:', err)
    });
  }
}
