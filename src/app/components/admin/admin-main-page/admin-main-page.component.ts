import { Component } from '@angular/core';
import {CalendarComponent} from '../calendar/calendar.component';

@Component({
  selector: 'admin-main-page',
  imports: [
    CalendarComponent
  ],
  templateUrl: './admin-main-page.component.html',
  styleUrl: './admin-main-page.component.css',
  standalone: true
})
export class AdminMainPageComponent {

}
