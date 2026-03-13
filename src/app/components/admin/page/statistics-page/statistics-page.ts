import {Component, Input, OnInit, Output} from '@angular/core';
import {GraphComponent} from './graph/graph.component';
import {NewDatePickerComponent} from '../../date-picker/new-date-picker.component';
import {Statistic} from '../../../Interface/Statistic';
import {CamperPlaceService} from '../../../../service/CamperPlaceService';
import {StatisticsService} from '../../../../service/StatisticsService';
import {StatisticTableComponent} from './statistic-table/statistic-table.component';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {forkJoin, take} from 'rxjs';

@Component({
  selector: 'statistics',
  imports: [
    GraphComponent,
    NewDatePickerComponent,
    StatisticTableComponent,
    MatGridList,
    MatGridTile,
  ],
  templateUrl: './statistics-page.html',
  styleUrl: './statistics-page.css',
  standalone: true
})
export class StatisticsPage implements OnInit{

  @Input() month: number = new Date().getMonth();
  @Input() year: number = new Date().getFullYear();
  @Output() reservationCount: Statistic[] = [];
  @Output() revenue: Statistic[] = [];

  camperPlaceIds: number[] = []

  constructor(
    private camperPlaceService: CamperPlaceService,
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
    this.camperPlaceService.getCamperPlaces().pipe(take(1)).subscribe(cps => {
      this.camperPlaceIds = cps.map(c => c.id);

      forkJoin({
        revenue: this.statisticsService.getRevenue(this.month, this.year).pipe(take(1)),
        count: this.statisticsService.getReservationCount(this.month, this.year).pipe(take(1))
      }).subscribe(({revenue, count}) => {
        this.revenue = revenue;
        this.reservationCount = count;
      });
    });
  }
}
