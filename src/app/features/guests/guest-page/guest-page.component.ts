import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material/core';
import {DtoDisplayDataMap, RegularTableComponent, Sort} from '@shared/ui/data-table/regular-table.component';
import {PopupFormService} from '@core/services/PopupFormService';
import {Guest} from '@core/models/Guest';
import {GuestFormData} from '@shared/form/guest-form.component';
import {Api} from '../../../api/api';
import {GuestDto} from '../../../api';
import {BehaviorSubject,Subscription} from 'rxjs';
import {Page} from '@core/models/Page';
import {SearchCriteria} from '../../../api/models/search-criteria';
import {GuestService} from '@features/guests/services/GuestService';

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
      (sortInfo)="getSortInfo($event)"
      (filterInfo)="getFilterInfo($event)"
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
  ];
  protected displayedColumns = ['Imię', 'Nazwisko', 'Email', 'Numer telefonu', 'Rejestracja'];

  protected paginatorLength = 0;
  protected pageSize = 10;
  protected pageSizeOptions = [10, 20, 50, 100];
  protected paginator?: MatPaginator;

  private sub?: Subscription;

  private lastParams: {
    event?: PageEvent,
    sort?: Sort,
    searchCriteria?: SearchCriteria
  } = {};

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  protected fetchData(event?: PageEvent, sort?: Sort, searchCriteria?: SearchCriteria) {
    this.lastParams = { event: event || this.lastParams.event, sort: sort || this.lastParams.sort, searchCriteria: searchCriteria || this.lastParams.searchCriteria };

    const page = this.lastParams.event?.pageIndex || 0;
    const size = this.lastParams.event?.pageSize || 10;


    this.sub?.unsubscribe();
    this.sub = this.guestService.findBy(
      this.lastParams.event,
      page,
      size,
      this.lastParams.sort,
      this.lastParams.searchCriteria
    ).subscribe((p: Page<GuestDto>) => {

      const mapDtoToDisplayData = (dto: GuestDto) => {
        return {
          carRegistration: dto.carRegistration,
          email: dto.email,
          firstname: dto.firstname,
          lastname: dto.lastname,
          phoneNumber: dto.phoneNumber,
        } as GuestDisplayData
      }

      const mappedContent: DtoDisplayDataMap[] = p.content.map(g => ({ dto: g, displayData: mapDtoToDisplayData(g) } as DtoDisplayDataMap));

      const displayPage: Page<DtoDisplayDataMap> = {
        ...p,
        content: mappedContent
      };

      this.pagedData$.next(displayPage);
      this.paginatorLength = displayPage.totalElements;
    });
  }

  protected getSortInfo(sort: Sort) {
    this.fetchData(undefined, sort);
  }

  protected getFilterInfo(searchCriteria: SearchCriteria) {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    console.log(searchCriteria)
    this.fetchData(undefined, undefined, searchCriteria);
  }

  protected getPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
  }

  protected openFormPopup(guest?: Guest) {
    const guestFd: GuestFormData = {guest: guest};
    this.formService.openGuestFormPopup(guestFd).afterClosed().subscribe(refreshed => {
      if (refreshed) {
        this.fetchData();
      }
    });
  }
}

export type GuestDisplayData ={
  carRegistration: string;
  email: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
}
