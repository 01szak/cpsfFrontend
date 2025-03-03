import {Component, OnInit} from '@angular/core';
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
export class StatisticsComponent implements  OnInit {
  camperPlaces: CamperPlace[] = [];
  month: number = 0;
  year: number = 0;

  reservationCountPerCamperPlace: Map<number, number> = new Map;
  revenuePerCamperPlace: Map<number, number> = new Map;

  constructor(private camperPlaceService: CamperPlaceService, private statisticsService: StatisticsService) {
  }

  ngOnInit() {
    this.loadCamperPlaces();

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


    this.camperPlaces.forEach(cp => {

      if (cp.id != null) {
        this.statisticsService.getMonthlyReservationCount(cp.id, this.month, this.year).subscribe({
          next: (value) => {
            if (cp.id != null) {
              this.reservationCountPerCamperPlace.set(cp.id, value);
            }
          },
          error: (err) => {
            console.log(err)
          }
        })
      }
    })

  }

  showRevenue() {
    this.camperPlaces.forEach(cp => {
      if (cp.id != null) {
        this.statisticsService.getMonthlyRevenue(cp.id, this.month, this.year).subscribe({
          next: (value) => {
            if (cp.id != null) {
              this.revenuePerCamperPlace.set(cp.id, value);
            }

          },
          error: (err) => {
            console.log(err)
          }
        })
      }
    })

  }

  protected readonly Number = Number;
}
