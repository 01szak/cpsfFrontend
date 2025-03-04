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
  @Input() reservationCountPerCamperPlace: Map<number, number> = new Map();
  @Input() revenuePerCamperPlace: Map<number, number> = new Map();

  totalReservationCount: number = 0;
  totalRevenue: number = 0;


  calculateTotals() {
    this.totalReservationCount = Array.from(this.reservationCountPerCamperPlace.values()).reduce((a,b) => a + b, 0)
    this.totalRevenue = Array.from(this.revenuePerCamperPlace.values()).reduce((a,b) => a + b, 0)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reservationCountPerCamperPlace']?.currentValue || changes['revenuePerCamperPlace']?.currentValue)
      this.calculateTotals();
  }
  showTotalResCount(){
    return this.revenuePerCamperPlace? Array.from(this.reservationCountPerCamperPlace.values()).reduce((a, b) => a + b, 0) : 0;
  }
  showTotalRevenue(){
    return this.revenuePerCamperPlace? Array.from(this.revenuePerCamperPlace.values()).reduce((a, b) => a + b, 0) : 0;
  }

  protected readonly Array = Array;
}
