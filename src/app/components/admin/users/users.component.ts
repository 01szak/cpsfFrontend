import { Component } from '@angular/core';

@Component({
  selector: 'users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  standalone: true
})
export class UsersComponent {

}
export enum UserTypes{
  ADMIN,GUEST
}
