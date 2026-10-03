import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material/core';
import {
  FetchParams,
  Field,
  RegularTableComponent
} from '@shared/ui/data-table/regular-table.component';
import {PopupFormService} from '@core/services/PopupFormService';
import {GuestFormData} from '@shared/form/guest-form.component';
import {GuestDto, SearchCriteria} from '../../../api';
import {GuestService} from '@core/services/openApiWrappers/GuestService';
import {COUNTRIES} from '@shared/constants/COUNTRIES';

@Component({
  selector: 'users',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatNativeDateModule,
    RegularTableComponent,
  ],
  template:  `
    <app-regular-table
      [page$]="guestService.guestDtoPage"
      [tabColumns]="columns"
      [displayedColumns]="displayedColumns"
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      [serviceInstance]="null"
      [fetchFunc]="fetchData.bind(this)"
      [onClickFunc]="openFormPopup.bind(this)"
      [createFunc]="openFormPopup.bind(this)"
      (paginatorReady)="getPaginator($event)">
    </app-regular-table>
  `,
  styles:  ``,
  standalone: true
})
export class GuestPage implements OnInit {
  private formService = inject(PopupFormService);
  protected guestService = inject(GuestService);

  protected columns: Field[] = [
    {name: 'firstname', type: 'TEXT', value: ''},
    {name: 'lastname', type: 'TEXT', value: ''},
    {name: 'email', type: 'TEXT', value: ''},
    {name: 'phoneNumber', type: 'TEXT', value: ''},
    {name: 'carRegistration', type: 'TEXT', value: ''},
    {name: 'country', type: 'TEXT', value: ''},
  ];
  protected displayedColumns = ['Imię', 'Nazwisko', 'Email', 'Numer telefonu', 'Rejestracja', 'Narodowość'];

  protected pageSize = 10;
  protected pageSizeOptions = [10, 20, 50, 100];
  protected paginator?: MatPaginator;

  ngOnInit() {
    this.guestService.findBy();
  }

  protected fetchData(params: FetchParams) {
    const searchCriteria = params.searchCriteria?.map(sc => {
      if (sc.key !== 'country' || !sc.value) return sc;
      const value = sc.value.toLowerCase();
      const country = COUNTRIES.find(c =>
        c.name.toLowerCase() === value || c.isoCode.toLowerCase() === value
      );
      return {...sc, value: country?.isoCode || sc.value} as SearchCriteria;
    });
    this.guestService.findBy(params.event, undefined, undefined, params.sort, searchCriteria);
  }

  protected getPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
  }

  protected openFormPopup(guest?: GuestDto) {
    const guestFd: GuestFormData = {guest: guest};
    this.formService.openGuestFormPopup(guestFd);
  }
}

export type GuestDisplayData ={
  carRegistration: string;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  country: string;
}
