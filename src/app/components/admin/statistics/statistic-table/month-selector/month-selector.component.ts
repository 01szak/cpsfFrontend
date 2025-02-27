import {Component, EventEmitter, Output} from '@angular/core';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-month-selector',
  imports: [
    NgForOf,
    FormsModule
  ],
  templateUrl: './month-selector.component.html',
  standalone: true,
  styleUrl: './month-selector.component.css'
})
export class MonthSelectorComponent {
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December","All Months"];
  currentMonth: string = this.months[this.months.length - 1];
  @Output() selectMonthEvent = new  EventEmitter<number>();
  selectMonth(month:string){
    if(month === this.months[this.months.length - 1] ){
      this.selectMonthEvent.emit(-1);

    }else{
      this.selectMonthEvent.emit(this.months.indexOf(month));

    }
  }
}
