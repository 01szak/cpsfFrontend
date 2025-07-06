import {Component, EventEmitter,  Output} from '@angular/core';
import {MatCard} from '@angular/material/card';

@Component({
  selector: 'app-new-date-picker',
  imports: [
    MatCard
  ],
  templateUrl: './new-date-picker.component.html',
  standalone: true,
  styleUrl: './new-date-picker.component.css'
})
export class NewDatePickerComponent {
  @Output() month = new EventEmitter<number>();
  @Output() year= new EventEmitter<number>(); months: string[] = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
  currentMonth: string = this.months[new Date().getMonth()];
  yearForTemplate: number = new Date().getFullYear();
  monthForTemplate: string = this.months[new Date().getMonth()]

  decreaseMonth() {
    let index = this.months.indexOf(this.currentMonth);
    if (index < 1) {
      this.yearForTemplate --;
      this.year.emit(this.yearForTemplate)
      index = this.months.length;
    }
    let month = index - 1;
    this.currentMonth = this.months[month];
    this.monthForTemplate = this.months[month];
    this.month.emit(month)
  }

  increaseMonth() {
    let index = this.months.indexOf(this.currentMonth);
    if (index >= this.months.length - 1) {
      this.yearForTemplate ++;
      this.year.emit(this.yearForTemplate)
      index = -1
    }
    let month = index + 1;
    this.currentMonth = this.months[month];
    this.monthForTemplate = this.months[month];
    this.month.emit(month);
  }

}
