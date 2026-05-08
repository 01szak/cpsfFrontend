import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-reservation-cell',
  imports: [],
  template: `
    <div #res class="content"> <p>rezerwacja</p></div>
  `,
  styles: `
    .content {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 0, 0, 0.79);
      border-radius: 10px;
      border: solid 3px red;

      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 5px;

      overflow: hidden;
      white-space: nowrap;
    }
  `
})
export class ReservationCellComponent {

}
