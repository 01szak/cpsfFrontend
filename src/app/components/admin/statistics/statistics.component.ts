import {Component, OnInit, SimpleChanges} from '@angular/core';
import {StatisticTableComponent} from './statistic-table/statistic-table.component';
import {GraphComponent} from './graph/graph.component';
import {CamperPlace} from '../calendar/CamperPlace';
import {CamperPlaceService} from '../../../service/CamperPlaceService';
import {MonthSelectorComponent} from './statistic-table/month-selector/month-selector.component';
import {MatCard} from '@angular/material/card';
import {StatisticsService} from '../../../service/StatisticsService';
import {YearSelectorComponent} from './statistic-table/year-selector/year-selector.component';

@Component({
  selector: 'statistics',
  imports: [
    StatisticTableComponent,
    GraphComponent,
    MonthSelectorComponent,
    MatCard,
    YearSelectorComponent
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
  standalone: true
})
export class StatisticsComponent implements OnInit {
  camperPlaces: CamperPlace[] = [];
  month: number = 0;
  year: number = 0;

  reservationCountPerCamperPlace: [number,number][] = [];
  revenuePerCamperPlace: [number,number][] = [];

  constructor(private camperPlaceService: CamperPlaceService, private statisticsService: StatisticsService) {
  }

  ngOnInit() {
    this.loadCamperPlaces();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['month']?.currentValue || changes['year']?.currentValue) {
      this.showReservationCount();
      this.showRevenue();
      console.log("zmiana resCount", this.reservationCountPerCamperPlace)
      console.log("zmiana rev", this.revenuePerCamperPlace)
    }

  }

  selectMonth(month: number) {
    this.month = month + 1;
    this.showReservationCount()
    this.showRevenue()
  }

  selectYear(year: number) {
    this.year = year;
    this.showReservationCount()
    this.showRevenue()

  }

  loadCamperPlaces() {
    this.camperPlaceService.getAllCamperPlaces().subscribe({
      next: (camperPlaces) => {
        this.camperPlaces = camperPlaces;
        this.showReservationCount();
        this.showRevenue();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  showReservationCount() {
    const camperPlaceIds: number[] = this.camperPlaces.map(cp => cp?.id ?? 0);
    this.statisticsService.getMonthlyReservationCount(camperPlaceIds,this.month,this.year).subscribe(
      {
        next:(value) => {
          this.reservationCountPerCamperPlace = value;
        },
        error:(err) => {
          console.log(err)
        }
      });
  }

  showRevenue() {
    const camperPlaceIds: number[] = this.camperPlaces.map(cp => cp?.id ?? 0);
    this.statisticsService.getMonthlyRevenue(camperPlaceIds,this.month,this.year).subscribe(
      {
        next:(value) => {
          this.revenuePerCamperPlace = value;
        },
        error:(err) => {
          console.log(err)
        }
      });

  }

  protected readonly Number = Number;
  protected readonly Array = Array;
}
