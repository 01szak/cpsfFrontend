import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {Statistic} from '../../new/InterfaceN/Statistic';
import {MatCard} from '@angular/material/card';


@Component({
  selector: 'app-statistic-table',
  templateUrl: './statistic-table.component.html',
  styleUrl: './statistic-table.component.css',
  imports: [
    MatTableModule,
    CommonModule,
    MatCard,
  ],
  standalone: true
})
export class StatisticTableComponent implements OnInit, OnChanges{
  displayedColumns: string[] = ['camperPlaceNumber', 'reservationCount', 'revenue'];
  displayedFooterColumns: string[] = ['sum'];

  @Input() revenue: Statistic[] = [];
  @Input() reservationCount: Statistic[] = [];
  displayData: {camperPlaceNumber: string, reservationCount: string, revenue: string}[] = []

  ngOnInit() {
    this.connectTables();
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['revenue'] || changes['reservationCount']) {
      this.connectTables();
    }
  }

  connectTables() {
    this.displayData = [];
    this.reservationCount.forEach((d, index) => {
      this.displayData.push({
        camperPlaceNumber: d.name.toString(),
        reservationCount: d.value.toString(),
        revenue: this.revenue[index].value.toString() }
      )
    })
  }

  countResCount() {
    return this.displayData.reduce((sum, row) => sum + Number(row.reservationCount), 0);
  }

  countRevenue() {
    return this.displayData.reduce((sum, row) => sum + Number(row.revenue), 0);
  }
}
