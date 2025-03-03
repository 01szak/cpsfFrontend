import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CamperPlace} from '../../calendar/CamperPlace';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MatCard} from '@angular/material/card';
import {StatisticsService} from '../../../../service/StatisticsService';
import {CamperPlaceService} from '../../../../service/CamperPlaceService';
import {TreeError} from '@angular/compiler';

@Component({
  selector: 'app-graph',
  imports: [
    NgxChartsModule,
    MatCard
  ],
  templateUrl: './graph.component.html',
  standalone: true,
  styleUrl: './graph.component.css'
})
export class GraphComponent implements OnInit, OnChanges {
  @Input() month: number = 0;
  @Input() year: number = 0;
  camperPlaces: CamperPlace[] = [];
  reservationCountPerCamperPlace: Map<number, number> = new Map();
  revenuePerCamperPlace: Map<number, number> = new Map();
  resCountChartData: { name: number, value: number }[] = [];

  constructor(private statisticsService: StatisticsService, private camperPlaceService: CamperPlaceService) {
  }

  ngOnInit() {
    this.loadCamperPlace()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['month']?.currentValue || changes['year']?.currentValue) {
      this.loadResCountChart()
      this.getReservationCount();
      this.getRevenue();
    }

  }

  getReservationCount() {
    this.camperPlaces.forEach(cp => {
      if (cp.id != null) {
        this.statisticsService.getMonthlyReservationCount(cp.id, this.month, this.year).subscribe({
          next: (resCount) => {
            this.reservationCountPerCamperPlace.set(cp.number || 0, resCount)
          }

        })
      }
    })
  }

  loadCamperPlace() {
    this.camperPlaceService.getAllCamperPlaces().subscribe({
      next: (value) => {
        this.camperPlaces = value;
        this.loadResCountChart()
        console.log(this.resCountChartData)
        this.getReservationCount();
        this.getRevenue();
      }
    })
  }


  loadResCountChart() {
    if (!this.camperPlaces) {
      return;
    }
    const camperPlaceIds: number[] = this.camperPlaces!.map(camperPlace => camperPlace.id || 0);
    this.statisticsService.getReservationCountForChart(this.month, this.year, camperPlaceIds).subscribe({
      next: (resCount) => {
        this.resCountChartData = [];
        console.log(this.resCountChartData)
        Array.from(resCount).forEach((count, index) => this.resCountChartData.push({
            name: index + 1,
            value: count

          }
        ));
      }
    })

  }


  getRevenue() {
    this.camperPlaces.forEach(cp => {
      if (cp.id != null) {
        this.statisticsService.getMonthlyRevenue(cp.id, this.month, this.year).subscribe({
          next: (revenue) => {
            this.reservationCountPerCamperPlace.set(cp.number || 0, revenue)
          }
        })
      }
    })
  }

  transferReservationCountToChart() {
    return Array.from(this.reservationCountPerCamperPlace.entries()).map(([key, value]) => ({
      name: key,
      value: value
    }))

  }

  transferRevenueToChart() {
    return Array.from(this.revenuePerCamperPlace.entries()).map(([key, value]) => ({
      name: key,
      value: value
    }))

  }

  protected readonly Array = Array;

  hideHalfNumbers(val:number) {
    if (val % 1 === 0) {
      return val.toString()
    } else {
      return ''
    }

  }
}
