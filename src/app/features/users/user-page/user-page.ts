import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material/core';
import {RegularTableComponent} from '@shared/ui/data-table/regular-table.component';
import {PopupFormService} from '@core/services/PopupFormService';
import {Guest} from '@core/models/Guest';
import {UserService} from '@features/users/services/UserService';
import {BaseTablePage} from '@shared/base/BaseTablePage';

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
export class UserPage extends BaseTablePage<Guest, UserService> implements OnInit, OnDestroy{

  constructor(
    protected userService: UserService,
    protected override formService: PopupFormService
  ) {
    super(userService);
    this.formService = formService;
    this.columns = [
      {type: 'text',field: 'firstname'},
      {type: 'text',field: 'lastname'},
      {type: 'text',field: 'email'},
      {type: 'text',field: 'phoneNumber'},
      {type: 'text',field: 'carRegistration'},
    ];
    this.displayedColumns = ['Imię', 'Nazwisko', 'Email', 'Numer telefonu', 'Rejestracja'];
  }

  ngOnInit() {
    super.fetchData(this.event, this.page, this. size);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  protected override openCreatePopup() {
    // this.formService.openCreateUserFormPopup();
  }

  protected override openUpdatePopup(guest: Guest) {
    // this.formService.openUpdateUserPopup(guest);
  }


}
