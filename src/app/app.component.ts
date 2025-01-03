import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardHeader, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FooterComponent,
    MatSlideToggleModule,
    MatCardHeader,
    MatCardTitle,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'untitled';
}
