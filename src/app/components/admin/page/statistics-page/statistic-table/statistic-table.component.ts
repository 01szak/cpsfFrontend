import {ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import {MatCard} from '@angular/material/card';
import {Revenue} from '../statistics-page';
import {GraphComponent} from '../graph/graph.component';
import {Statistic} from '../../../../Interface/Statistic';


@Component({
  selector: 'app-statistic-table',
  templateUrl: './statistic-table.component.html',
  styleUrl: './statistic-table.component.css',
  imports: [
    MatTableModule,
    CommonModule,
    MatCard,
    GraphComponent
  ],
  standalone: true
})
export class StatisticTableComponent implements OnInit, OnChanges{

  private cdr = inject(ChangeDetectorRef);

  displayedColumns: string[] = ['camperPlaceNumber', 'reservationCount', 'revenue'];

  @Input() revenue: Revenue[] = [];
  @Input() title: string = '';

  displayData: {camperPlaceNumber: string, reservationCount: string, revenue: string}[] = []
  showGraph: boolean = false;
  graphMode: 'revenue' | 'count' = 'revenue';

  ngOnInit() {
    this.connectTables();
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['revenue'] || changes['reservationCount'] || changes['potentialRevenue']) {
      this.connectTables();
    }
  }

  toggleView() {
    this.showGraph = !this.showGraph;
    this.cdr.detectChanges();
  }

  toggleGraphMode() {
    this.graphMode = this.graphMode === 'revenue' ? 'count' : 'revenue';
    this.cdr.detectChanges();
  }

  getGraphData(): Statistic[] {
    return this.revenue.map(r => ({
      name: r.cpIndex,
      value: this.graphMode === 'revenue' ? r.revenue : (r.count ?? 0)
    }));
  }

  connectTables() {
    const newData: any[] = [];

    const allIndices = new Set([
      ...this.revenue.map(r => r.cpIndex),
    ]);

    allIndices.forEach(index => {
      const paidRev = this.revenue.find(r => r.cpIndex === index)?.revenue ?? 0;
      const countData = this.revenue.find(c => c.cpIndex === index)?.count ?? 0;

      newData.push({
        camperPlaceNumber: index,
        reservationCount: countData,
        revenue: paidRev.toString(),
      });
    });

    newData.sort((a, b) => a.camperPlaceNumber.localeCompare(b.camperPlaceNumber, undefined, {numeric: true}));

    this.displayData = newData;
    this.cdr.detectChanges();
  }


  countResCount() {
    return this.displayData.reduce((sum, row) => sum + Number(row.reservationCount), 0);
  }

  countRevenue() {
    return this.displayData.reduce((sum, row) => sum + Number(row.revenue), 0);
  }

}
