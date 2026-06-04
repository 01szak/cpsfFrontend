import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material/core';
import {DtoDisplayDataMap, FetchParams, RegularTableComponent} from '@shared/ui/data-table/regular-table.component';
import {PopupFormService} from '@core/services/PopupFormService';
import {GuestFormData} from '@shared/form/guest-form.component';
import {GuestDto} from '../../../api';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Page} from '@core/models/Page';
import {GuestService} from '@features/guests/services/GuestService';
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
      [page$]="pagedData$"
      [tabColumns]="columns"
      [displayedColumns]="displayedColumns"
      [pageSize]="pageSize"
      [paginatorLength]="paginatorLength"
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
export class GuestPage implements OnInit, OnDestroy {
  private formService = inject(PopupFormService);
  private guestService = inject(GuestService);

  protected pagedData$ = new BehaviorSubject<Page<DtoDisplayDataMap>>({
    content: [],
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0
  });

  protected columns = [
    {type: 'text', field: 'firstname'},
    {type: 'text', field: 'lastname'},
    {type: 'text', field: 'email'},
    {type: 'text', field: 'phoneNumber'},
    {type: 'text', field: 'carRegistration'},
    {type: 'text', field: 'country'},
  ];
  protected displayedColumns = ['Imię', 'Nazwisko', 'Email', 'Numer telefonu', 'Rejestracja', 'Narodowość'];

  protected paginatorLength = 0;
  protected pageSize = 10;
  protected pageSizeOptions = [10, 20, 50, 100];
  protected paginator?: MatPaginator;

  private dataSub?: Subscription;
  private lastParams = {} as FetchParams;

  ngOnInit() {
    this.dataSub = this.guestService.guestDtos$.subscribe((p: Page<GuestDto>) => {
      this.mapAndPushData(p);
    });

    this.fetchData({});
  }

  ngOnDestroy() {
    this.dataSub?.unsubscribe();
  }

  protected fetchData(params: FetchParams) {
    this.lastParams = { ...this.lastParams, ...params };

    const page = this.lastParams.event?.pageIndex || 0;
    const size = this.lastParams.event?.pageSize || 10;

    this.guestService.findBy(
      this.lastParams.event,
      page,
      size,
      this.lastParams.sort,
      this.lastParams.searchCriteria
    ).subscribe();
  }

  private mapAndPushData(p: Page<GuestDto>) {
    const mapDtoToDisplayData = (dto: GuestDto) => ({
      carRegistration: dto.carRegistration || '',
      email: dto.email || '',
      firstname: dto.firstname || '',
      lastname: dto.lastname || '',
      phoneNumber: dto.phoneNumber || '',
      country: COUNTRIES.find(c => c.isoCode.toLowerCase() === (dto.country?.toLowerCase() || ''))?.name || '',
    } as GuestDisplayData);

    const mappedContent: DtoDisplayDataMap[] = p.content.map(g => ({
      dto: g,
      displayData: mapDtoToDisplayData(g)
    } as DtoDisplayDataMap));

    const displayPage: Page<DtoDisplayDataMap> = {
      ...p,
      content: mappedContent
    };

    this.pagedData$.next(displayPage);
    this.paginatorLength = displayPage.totalElements;
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
