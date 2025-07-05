import { Component } from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {RouterOutlet} from '@angular/router';
import {MatCard} from '@angular/material/card';
@Component({
  selector: 'admin-page',
  imports: [
    NavbarComponent,
    RouterOutlet,
    MatCard,
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css',
  standalone: true
})
export class AdminPageComponent {

}
