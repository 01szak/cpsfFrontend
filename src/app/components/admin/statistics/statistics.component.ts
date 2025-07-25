import {Component, Input, OnInit, Output} from '@angular/core';
import {GraphComponent} from './graph/graph.component';
import {NewDatePickerComponent} from './../new/new-date-picker/new-date-picker.component';
import {Statistic} from './../new/InterfaceN/Statistic';
import {NewCamperPlaceService} from './../new/serviceN/NewCamperPlaceService';
import {StatisticsService} from './../../../service/StatisticsService';
import {StatisticTableComponent} from './statistic-table/statistic-table.component';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';

@Component({
  selector: 'statistics',
  imports: [
    GraphComponent,
    NewDatePickerComponent,
    StatisticTableComponent,
    MatGridList,
    MatGridTile,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
  standalone: true
})
export class StatisticsComponent implements OnInit{

  @Input() month: number = new Date().getMonth();
  @Input() year: number = new Date().getFullYear();
  @Output() reservationCount: Statistic[] = [];
  @Output() revenue: Statistic[] = [];

  camperPlaceIds: number[] = []

  constructor(
    private camperPlaceService: NewCamperPlaceService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  changeMonth(event: number) {
    this.month = event;
    console.log("month changed: " +  this.month)
    this.loadData();
  }

  changeYear(event:number) {
    this.year = event;
    console.log("year changed: " +  this.year)
    this.loadData();
  }

  loadData() {
    this.camperPlaceService.getCamperPlaces().subscribe(cps => {
      this.camperPlaceIds = []
      cps.forEach(c => this.camperPlaceIds.push(c.id))

      this.statisticsService.getRevenue(this.month, this.year).subscribe(s => {
        this.revenue = [];
        this.revenue = s;
      })

      this.statisticsService.getReservationCount(this.month, this.year).subscribe(s => {
        this.reservationCount = [];
        this.reservationCount = s;
      })
    })
  }
}
