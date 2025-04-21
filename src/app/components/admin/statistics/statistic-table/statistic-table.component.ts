import {AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {CamperPlace} from '../../calendar/CamperPlace';
import {MatMonthView} from '@angular/material/datepicker';

@Component({
  selector: 'app-statistic-table',
  templateUrl: './statistic-table.component.html',
  styleUrl: './statistic-table.component.css',
  imports: [
    MatCardModule,
    MatTableModule,
    CommonModule,
    MatMonthView
  ],
  standalone: true
})
export class StatisticTableComponent implements OnChanges {
  displayedColumns: string[] = ['camperPlaceNumber', 'reservationCount', 'revenue'];
  @Input() camperPlaces: CamperPlace[] = [];
  @Input() reservationCountPerCamperPlace: [number,number][] = [];
  @Input() revenuePerCamperPlace: [number,number][] = [];

  // totalReservationCount: number = 0;
  // totalRevenue: number = 0;
  //
  //
  // calculateTotals() {
  //   this.totalReservationCount = Array.from(this.reservationCountPerCamperPlace.values()).reduce((a,b) => a + b, 0)
  //   this.totalRevenue = Array.from(this.revenuePerCamperPlace.values()).reduce((a,b) => a + b, 0)
  // }
  getReservationCountPerCamperPlace(camperPlace: CamperPlace){
    return this.reservationCountPerCamperPlace.find(([id, _]) => id === camperPlace.id)?.[1] ?? 0
  }
  getRevenuePerCamperPlace(camperPlace: CamperPlace){
    return this.revenuePerCamperPlace.find(([id, _]) => id === camperPlace.id)?.[1] ?? 0
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['reservationCountPerCamperPlace']?.currentValue || changes['revenuePerCamperPlace']?.currentValue) {
      // this.calculateTotals();
      console.log("dupa", Array.from(this.reservationCountPerCamperPlace.entries()))
      console.log("dupaduapghys", Array.from(this.revenuePerCamperPlace.entries()))
    }
  }
  showTotalResCount(): number {
    if (!this.reservationCountPerCamperPlace) return 0;
    return this.reservationCountPerCamperPlace.reduce((sum, [, value]) => sum + value, 0);
  }
  showTotalRevenue(): number {
    if (!this.revenuePerCamperPlace) return 0;
    return this.revenuePerCamperPlace.reduce((sum, [, value]) => sum + value, 0);
  }


  protected readonly Array = Array;
}
