import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material/core';
import {RegularTableComponent, Sort} from '../regular-table/regular-table.component';
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
  pageSize: number = 0;
  pageSizeOptions: number[] = [10, 20, 50, 100]

  sortInfo!: Sort;
  event?: PageEvent;
  page: number|undefined = 0;
  size: number|undefined = 0


  constructor(
    private userServiceN: NewUserService,
    protected formService: PopupFormService) {
  }

  ngOnInit() {
    this.fetchData(undefined, 0, 10);
  }

  getSortInfo(sort: Sort) {
    this.sortInfo = sort;
    this.fetchData(this.event, this.page, this.size);
  }

  fetchData(event?: PageEvent, page?: number, size?: number) {
    if (event) this.event = event;
    if (page !== undefined) this.page = page;
    if (size !== undefined) this.size = size;
    this.userServiceN.findAll(
      this.event,
      this.page,
      this.size,
      this.sortInfo
    ).subscribe(p => {
        this.allUsers = p.content
        this.pageSizeOptions = this.setPageSizeOptions(this.pageSizeOptions, p.totalElements);
      })
  }

  setPageSizeOptions(pageSizeOptions: number[], totalElements: number ) {
    if (totalElements <= pageSizeOptions[0]) {
      return [totalElements];
    }
    if (!pageSizeOptions.includes(totalElements) || totalElements < pageSizeOptions[pageSizeOptions.length - 1]) {
      for (let i = pageSizeOptions.length - 1 ; i >= 0; i--) {
        if (pageSizeOptions[i] > totalElements) {
          pageSizeOptions.pop();
        }else {
          if (pageSizeOptions.includes(totalElements)) {
            return [...pageSizeOptions]
          }
          return [ ...pageSizeOptions, totalElements];
        }
      }
    }

    return pageSizeOptions
  }

  openCreatePopup() {
    this.formService.openCreateUserFormPopup();
  }

  openUpdatePopup(user: UserN) {
    this.formService.openUpdateUserPopup(user);
  }

}
