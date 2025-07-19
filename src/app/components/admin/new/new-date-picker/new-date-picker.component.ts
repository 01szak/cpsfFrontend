import {Component, EventEmitter,  Output} from '@angular/core';
import {MatCard} from '@angular/material/card';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-new-date-picker',
  imports: [
    MatCard,
    MatSelect,
    MatOption
  ],
  templateUrl: './new-date-picker.component.html',
  standalone: true,
  styleUrl: './new-date-picker.component.css'
})
export class NewDatePickerComponent {
  @Output() month = new EventEmitter<number>();
  @Output() year= new EventEmitter<number>();
  months: string[] =
    [
      "Pokaż dla wszystkich",
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzesień",
      "Październik",
      "Listopad",
      "Grudzień"
    ];
  years: string[] = [
    "2024",
    "2025",
  ]
  currentMonth: string = this.months[new Date().getMonth() + 1];
  yearForTemplate: number = new Date().getFullYear();
  monthForTemplate: string = this.months[new Date().getMonth() + 1]

  decreaseMonth() {
    let index = this.months.indexOf(this.currentMonth);
    index --;

    if (index === 0) {
      this.yearForTemplate --;
      this.year.emit(this.yearForTemplate)
      index = this.months.length - 1;
    }
    let month = index;
    this.currentMonth = this.months[month];
    this.monthForTemplate = this.months[month];
    this.month.emit(month - 1)
  }

  increaseMonth() {
    let index = this.months.indexOf(this.currentMonth) ;
     index ++;
    if (index >= this.months.length) {
      this.yearForTemplate ++;
      this.year.emit(this.yearForTemplate)
      index = 1
    }
    let month = index;
    this.currentMonth = this.months[month];
    this.monthForTemplate = this.months[month];
    this.month.emit(month - 1);
    console.log(month)
  }

  changeMonth(month: string) {
    let parsedMonth = this.months.indexOf(month);

    this.currentMonth = this.months[parsedMonth];
    this.month.emit(parsedMonth);
  }

  changeYear(year: number) {
    this.year.emit(year);
  }

}
