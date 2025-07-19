import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
export class NewDatePickerComponent implements OnInit {
  @Output() month = new EventEmitter<number>();
  @Output() year = new EventEmitter<number>();
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
  years: number[] = [
    2024,
    2025,
  ]
  currentMonth: string = this.months[new Date().getMonth() + 1];
  currentYear: number = new Date().getFullYear();

  ngOnInit() {
    this.addMissingYears()
  }


  decreaseMonth() {
    let index = this.months.indexOf(this.currentMonth);
    index--;

    if (index === 0) {
      this.currentYear--;
      if (!this.years.includes(this.currentYear)) {
        this.years.unshift(this.currentYear);
      }
      this.year.emit(this.currentYear)
      index = this.months.length - 1;
    }
    let month = index;
    this.currentMonth = this.months[month];
    this.month.emit(month - 1)
  }

  increaseMonth() {
    let index = this.months.indexOf(this.currentMonth);
    index++;
    if (index >= this.months.length) {
      this.currentYear++;
      if (!this.years.includes(this.currentYear)) {
        this.years.push(this.currentYear);
      }
      this.year.emit(this.currentYear)
      index = 1
    }
    let month = index;
    this.currentMonth = this.months[month];
    this.month.emit(month - 1);
  }

  changeMonth(month: string) {
    let index = this.months.indexOf(month);

    this.currentMonth = this.months[index];
    this.month.emit(index - 1);
  }

  changeYear(year: number) {
    let index = this.years.indexOf(year)
    this.currentYear = this.years[index];
    this.year.emit(this.currentYear);
  }

  addMissingYears() {
    let currentYear = new Date().getFullYear()
    let lasYearInTab = this.years[this.years.length - 1];
    while (currentYear > lasYearInTab) {
      this.years.push(lasYearInTab++);
    }
  }

}
