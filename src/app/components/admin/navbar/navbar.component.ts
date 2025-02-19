import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatDrawerContainer,MatDrawer} from '@angular/material/sidenav';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    MatDrawerContainer,
    MatDrawer,
    MatButton
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true
})
export class NavbarComponent {

  logout():void{
    sessionStorage.removeItem('jwtToken');
  }
}
