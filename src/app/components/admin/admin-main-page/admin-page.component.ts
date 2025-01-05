import { Component } from '@angular/core';
import {CalendarComponent} from '../calendar/calendar.component';
import {FooterComponent} from "../footer/footer.component";
import {RouterOutlet} from '@angular/router';
@Component({
  selector: 'admin-page',
  imports: [
    FooterComponent,
    RouterOutlet,
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css',
  standalone: true
})
export class AdminPageComponent {

}
