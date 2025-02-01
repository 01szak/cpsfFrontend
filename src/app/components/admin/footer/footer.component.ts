import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatDrawerContainer,MatDrawer} from '@angular/material/sidenav';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink,
    MatDrawerContainer,
    MatDrawer,
    MatButton
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  standalone: true
})
export class FooterComponent {

  logout():void{
    sessionStorage.removeItem('jwtToken');
  }
}
