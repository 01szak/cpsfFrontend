import { Component } from '@angular/core';
import {CalendarComponent} from '../calendar/calendar.component';
import {FooterComponent} from "../../footer/footer.component";
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'admin-main-page',
  imports: [
    CalendarComponent,
    FooterComponent,
    RouterOutlet
  ],
  templateUrl: './admin-main-page.component.html',
  styleUrl: './admin-main-page.component.css',
  standalone: true
})
export class AdminMainPageComponent {

}
