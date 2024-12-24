import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FooterComponent,
    MatSlideToggleModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'untitled';
}
