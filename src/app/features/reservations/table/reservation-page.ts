import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {ReservationService} from '@features/reservations/services/ReservationService';
import {PopupFormService} from '@core/services/PopupFormService';
import {RegularTableComponent, Sort} from '@shared/ui/data-table/regular-table.component';
import {ReservationFormData} from '@shared/form/reservation-form.component';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Page} from '@core/models/Page';
import {SearchCriteria} from '../../../api/models/search-criteria';
import {ReservationDto} from '../../../api';

@Component({
  selector: 'reservations',
  imports: [
    CommonModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    RegularTableComponent,
  ],
  templateUrl: './reservation-page.html',
  styleUrl: './reservation-page.css',
  standalone: true,
})
export class ReservationPage implements OnInit, OnDestroy {
  private reservationService = inject(ReservationService);
  private formService = inject(PopupFormService);

  protected pagedData$ = new BehaviorSubject<Page<ReservationDto>>({
    content: [],
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0
  });

  protected columns = [
    {type: 'date', field: 'checkin'},
    {type: 'date', field: 'checkout'},
    {type: 'text', field: 'stringUser'},
    {type: 'text', field: 'camperPlaceIndex'},
    {type: 'status', field: 'reservationStatus'},
    {type: 'checkbox', field: 'paid'}
  ];
  protected displayedColumns = ['Wjazd', 'Wyjazd', 'Gość', 'Parcela', 'Status', 'Opłacone'];

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

    this.sub?.unsubscribe();
    this.sub = this.reservationService.findBy(
      this.lastParams.event,
      undefined,
      undefined,
      this.lastParams.sort,
      this.lastParams.filter
    ).subscribe((p: Page<ReservationDto>) => {
      this.pagedData$.next(p);
      this.paginatorLength = p.totalElements;
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

  protected openFormPopup(reservation?: ReservationDto) {
    const reservationFd: ReservationFormData = {reservation: reservation};
    this.formService.openReservationFormPopup(reservationFd).afterClosed().subscribe(refreshed => {
      if (refreshed) {
        this.fetchData();
      }
    });
  }

  protected additionalFunc = (r: ReservationDto) => {
    let previousPaidStaus = r.paid;
    r.paid = !r.paid;
    this.reservationService.update(r).subscribe({
      error: () => r.paid = previousPaidStaus
    });
  };
}
