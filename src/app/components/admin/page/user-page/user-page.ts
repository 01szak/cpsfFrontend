import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material/core';
import {RegularTableComponent} from '../../regular-table/regular-table.component';
import {PopupFormService} from '../../../../service/PopupFormService';
import {User} from '../../../Interface/User';
import {UserService} from '../../../../service/UserService';
import {BaseTablePage} from '../BaseTablePage';

@Component({
  selector: 'users',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatNativeDateModule,
    RegularTableComponent,
  ],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css',
  standalone: true
})
export class UserPage extends BaseTablePage<User, UserService> implements OnInit, OnDestroy{

  constructor(
    protected userService: UserService,
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

  protected override openUpdatePopup(user: User) {
    this.formService.openUpdateUserPopup(user);
  }


}
