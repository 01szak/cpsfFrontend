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
export class GraphComponent implements  OnChanges {
  @Input() month: number = 0;
  @Input() year: number = 0;

  @Input() camperPlaces: CamperPlace[] = [];
  @Input() reservationCountPerCamperPlace: [number,number][] = [];
  @Input() revenuePerCamperPlace: [number,number][] = [];

  resCountChartData: { name: string, value: number }[] = [];

  revenueChartData: { name: string, value: number }[] = [];

  constructor(private statisticsService: StatisticsService, private camperPlaceService: CamperPlaceService) {
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes['reservationCountPerCamperPlace']?.currentValue || changes['revenuePerCamperPlace']?.currentValue) {
      this.loadRevenueChart();
      this.loadResCountChart();
      console.log("zmiana resCount", this.reservationCountPerCamperPlace)
      console.log("zmiana revCount", this.revenuePerCamperPlace)
    }

  }

  loadResCountChart() {
    this.resCountChartData = [];
    this.reservationCountPerCamperPlace.forEach(([key, value]) => {
      const camperPlace = this.camperPlaces.find(c => c.id === key);
      this.resCountChartData.push(
        {
          name: camperPlace?.index?.toString() ?? '',
          value: value
        }
      )
    })
    console.log('final resCount chart data', this.resCountChartData);
  }

  loadRevenueChart() {
    this.revenueChartData = [];
    this.revenuePerCamperPlace.forEach(([key, value]) => {
      const camperPlace = this.camperPlaces.find(c => c.id === key);
      this.revenueChartData.push(
        {
          name: camperPlace?.index?.toString() ?? '',
          value: value
        }
      )
    })
    console.log('final rev chart data', this.revenueChartData);
    console.log(this.camperPlaces)

  }

  protected readonly Array = Array;

  hideHalfNumbers(val: number) {
    if (val % 1 === 0) {
      return val.toString()
    } else {
      return ''
    }

  }
}
