import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material/core';
import {RegularTableComponent} from '../regular-table/regular-table.component';
import {ReservationN} from '../new/InterfaceN/ReservationN';
import {NewReservationService} from '../new/serviceN/NewReservationService';
import {PopupFormService} from '../new/serviceN/PopupFormService';
import {UserN} from '../new/InterfaceN/UserN';
import {NewUserService} from '../new/serviceN/NewUserService';

@Component({
  selector: 'reservations',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatNativeDateModule,
    RegularTableComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  standalone: true
})
export class UsersComponent implements OnInit{

  columns:  {type: string, field: string }[] = [
    {type: 'text',field: 'firstName'},
    {type: 'text',field: 'lastName'},
    {type: 'text',field: 'email'},
    {type: 'text',field: 'phoneNumber'},
    {type: 'text',field: 'carRegistration'},
  ]
  displayedColumns: string[] = ['Imię', 'Nazwisko', 'Email', 'Numer telefonu', 'Rejestracja'];
  allUsers: UserN[] = []
  allUsersSize: number = 0;
  pageSize: number = 0;
  pageSizeOptions: number[] = [12, 24, 50, 100]


  constructor(
    private userServiceN: NewUserService,
    protected formService: PopupFormService,
  ) {
  }

  ngOnInit() {
    this.fetchData(undefined, 1, 12);
  }


  fetchData(event?: PageEvent, page?: number, size?: number) {
    this.userServiceN.findAll(
      event,
      event == undefined ? page : undefined,
      event == undefined ? size : undefined)
      .subscribe(p => {
        this.allUsers = p.content
        this.allUsersSize = p.totalElements;
        this.pageSize = 12;
        this.pageSizeOptions = this.pageSizeOptions.includes(p.totalElements)
          ? this.pageSizeOptions
          : [...this.pageSizeOptions, p.totalElements];
      })
  }

  openCreatePopup() {
    this.formService.openCreateUserFormPopup();
  }

  openUpdatePopup(user: UserN) {
    this.formService.openUpdateUserPopup(user);
  }

}
