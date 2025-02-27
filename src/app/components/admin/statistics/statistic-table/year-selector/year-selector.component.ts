import {Component, EventEmitter, Output} from '@angular/core';
import {MatOption, MatSelect} from '@angular/material/select';
import {NgForOf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-year-selector',
  imports: [
    MatSelect,
    MatOption,
    NgForOf,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './year-selector.component.html',
  standalone: true,
  styleUrl: './year-selector.component.css'
})
export class YearSelectorComponent {
  years: number[] = [2024, 2025]
  currentYear = new Date().getFullYear();
  @Output() selectYearEvent = new EventEmitter<number>;

  ngOnInit() {
    this.addYears();
  }

  addYears() {
    if (this.currentYear !== this.years[this.years.length - 1]) {
      this.years.push(new Date().getFullYear());
    }
  }

  selectYear(year: number) {
    this.selectYearEvent.emit(year);
  }

  protected readonly Number = Number;
}
