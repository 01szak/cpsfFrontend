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
      [dtoData]="guestService.pageResource.value().content"
      [isLoading]="guestService.pageResource.isLoading()"
      [totalElements]="guestService.pageResource.value().totalElements"
      [tabColumns]="columns"
      [pageableSignal]="guestService.pageable"
      [searchCriteriaSignal]="guestService.searchCriteria"
      [onRowClickFunc]="openFormPopup.bind(this)"
      [createFunc]="openFormPopup.bind(this)"

    >
    </app-regular-table>
  `,
  styles:  ``,
  standalone: true
})
export class GuestPage {
  private formService = inject(PopupFormService);
  protected guestService = inject(GuestService);

  protected columns: Field[] = [
    {name: 'firstname', displayName: 'Imie', type: 'TEXT', value: ''},
    {name: 'lastname', displayName: 'Nazwisko', type: 'TEXT', value: ''},
    {name: 'email', displayName: 'Email', type: 'TEXT', value: ''},
    {name: 'phoneNumber', displayName: 'Numer telefonu', type: 'TEXT', value: ''},
    {name: 'carRegistration', displayName: 'Rejestracja', type: 'TEXT', value: ''},
    {name: 'country', displayName: 'Narodowość', type: 'TEXT', value: ''},
  ];
  protected paginator?: MatPaginator;

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
