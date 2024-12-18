import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CamperPlace} from './CamperPlace';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-calendar',
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  camperPlaces: Array<CamperPlace> = [];
  daysInAMonth?: number;

  addCamperPlaceToTheCalendar() {
    const calendar = document.getElementById("calendar") as HTMLTableElement | null;
    const firstRow = document.getElementById("mainRow") as HTMLTableRowElement | null;

    if (!calendar || !firstRow) {
      console.error("Table or header row not found");
      return;
    }

    this.daysInAMonth = firstRow.cells.length;

    const newRow = calendar.insertRow();

    const headerCell = newRow.insertCell();
    headerCell.outerHTML = `<th>${this.camperPlaces.length + 1}</th>`;

    for (let i = 1; i < this.daysInAMonth; i++) {
      const newCell = newRow.insertCell();
      newCell.textContent = "";
    }
    this.camperPlaces.push(new CamperPlace(this.camperPlaces.length + 1));
    console.log(this.camperPlaces);
  }


}
