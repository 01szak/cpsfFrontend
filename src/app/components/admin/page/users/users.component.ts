import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material/core';
import {RegularTableComponent} from '../../regular-table/regular-table.component';
import {PopupFormService} from '../../new/serviceN/PopupFormService';
import {UserN} from '../../new/InterfaceN/UserN';
import {NewUserService} from '../../new/serviceN/NewUserService';
import {BaseTablePage} from '../BaseTablePage';

@Component({
  selector: 'users',
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
export class UsersComponent extends BaseTablePage<UserN, NewUserService> implements OnInit, OnDestroy{

  constructor(
    protected userService: NewUserService,
    protected override formService: PopupFormService
  ) {
    super(userService);
    this.formService = formService;
    this.columns = [
      {type: 'text',field: 'firstName'},
      {type: 'text',field: 'lastName'},
      {type: 'text',field: 'email'},
      {type: 'text',field: 'phoneNumber'},
      {type: 'text',field: 'carRegistration'},
    ];
    this.displayedColumns = ['Imię', 'Nazwisko', 'Email', 'Numer telefonu', 'Rejestracja'];
  }

  ngOnInit() {
    super.fetchData(this.event, this.page, this. size);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  protected override openCreatePopup() {
    this.formService.openCreateUserFormPopup();
  }

  protected override openUpdatePopup(user: UserN) {
    this.formService.openUpdateUserPopup(user);
  }
}
