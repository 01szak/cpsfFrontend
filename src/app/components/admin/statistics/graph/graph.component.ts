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
  resCountChartData: { name: string, value: number }[] = [];

  revenueChartData: { name: string, value: number }[] = [];

  constructor(private statisticsService: StatisticsService, private camperPlaceService: CamperPlaceService) {
  }

  ngOnInit() {
    this.loadCamperPlace()
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['month']?.currentValue || changes['year']?.currentValue) {
      this.loadResCountChart()
      this.loadRevenueChart()
    }else if(this.month == 0){
      this.loadRevenueChart()
      this.loadResCountChart()

    }

  }



  loadCamperPlace() {
    this.camperPlaceService.getAllCamperPlaces().subscribe({
      next: (value) => {

        this.camperPlaces = value;
        this.loadResCountChart()
        this.loadRevenueChart();
      }
    })
  }


  loadResCountChart() {
    if (!this.camperPlaces) {
      return;
    }
    const camperPlaceIds: number[] = this.camperPlaces!.map(camperPlace => camperPlace.id || 0);
    this.statisticsService.getReservationCountForChart(this.month, this.year, camperPlaceIds).subscribe({
      next: (res) => {
        this.resCountChartData= [];
        this.camperPlaces.forEach((c,index) => {
          const a = Array.from(res)
          this.resCountChartData.push(
            {
              name: c.index?.toString() ||index.toString(),
              value: a[index]
            }
          )
        })

      }
    })

  }


  loadRevenueChart() {
    if (!this.camperPlaces) {
      return;
    }
    const camperPlaceIds: number[] = this.camperPlaces!.map(camperPlace => camperPlace.id || 0);
    this.statisticsService.getRevenueForChart(this.month, this.year, camperPlaceIds).subscribe({
      next: (rev) => {
        this.revenueChartData = [];
        this.camperPlaces.forEach((c,index) => {
          const a = Array.from(rev)
           this.revenueChartData.push(
             {
               name: c.index?.toString() ||index.toString(),
               value: a[index]
             }
           )
            })

      }
    })

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
