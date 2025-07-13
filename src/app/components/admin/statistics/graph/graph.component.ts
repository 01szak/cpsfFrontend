import {Component, Input} from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MatCard} from '@angular/material/card';
import {Statistic} from '../../new/InterfaceN/Statistic';

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
export class GraphComponent {
  @Input() month: number = 0;
  @Input()  year: number = 0;
  @Input() results: Statistic[] = []

  hideHalfNumbers(val: number) {
    if (val % 1 === 0) {
      return val.toString()
    } else {
      return ''
    }
  }

}
