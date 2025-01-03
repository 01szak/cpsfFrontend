import { Component } from '@angular/core';
import {AdminMainPageComponent} from '../admin/admin-main-page/admin-main-page.component';

@Component({
  selector: 'authorized-content',
  imports: [
    AdminMainPageComponent
  ],
  templateUrl: './authorized-content.component.html',
  styleUrl: './authorized-content.component.css',
  standalone: true,
})
export class AuthorizedContentComponent {


}
