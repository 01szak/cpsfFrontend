import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material/core';
import {RegularTableComponent, Sort} from '@shared/ui/data-table/regular-table.component';
import {PopupFormService} from '@core/services/PopupFormService';
import {Guest} from '@core/models/Guest';
import {GuestFormData} from '@shared/form/guest-form.component';
import {Api} from '../../../api/api';
import {findBy1} from '../../../api';
import {BehaviorSubject, from, Subscription} from 'rxjs';
import {Page} from '@core/models/Page';
import {SearchCriteria} from '../../../api/models/search-criteria';

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
export class UserPage implements OnInit, OnDestroy {
  private api = inject(Api);
  private formService = inject(PopupFormService);

  protected pagedData$ = new BehaviorSubject<Page<Guest>>({
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
    filter?: SearchCriteria
  } = {};

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  protected fetchData(event?: PageEvent, sort?: Sort, filter?: SearchCriteria) {
    this.lastParams = { event: event || this.lastParams.event, sort: sort || this.lastParams.sort, filter: filter || this.lastParams.filter };
    
    const pageable = {
      page: this.lastParams.event?.pageIndex || 0,
      size: this.lastParams.event?.pageSize || 10,
      sort: this.lastParams.sort ? [this.lastParams.sort.columnName + ',' + this.lastParams.sort.direction] : undefined
    };

    this.sub?.unsubscribe();
    this.sub = from(this.api.invoke(findBy1, {
      pageable,
      searchCriteria: this.lastParams.filter || { key: '', value: '' }
    })).subscribe((res: any) => {
      this.pagedData$.next(res);
      this.paginatorLength = res.totalElements;
    });
  }

  protected getSortInfo(sort: Sort) {
    this.fetchData(undefined, sort);
  }

  protected getFilterInfo(filter: SearchCriteria) {
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.fetchData(undefined, undefined, filter);
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
