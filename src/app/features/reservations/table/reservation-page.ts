import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {ReservationService} from '@features/reservations/services/ReservationService';
import {PopupFormService} from '@core/services/PopupFormService';
import {
  DtoDisplayDataMap,
  FetchParams,
  RegularTableComponent,
} from '@shared/ui/data-table/regular-table.component';
import {ReservationFormData} from '@shared/form/reservation-form.component';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Page} from '@core/models/Page';
import {GuestDto, ReservationDto} from '../../../api';

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
  template: `
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
      [additionalFunc]="additionalFunc"
      (paginatorReady)="getPaginator($event)">
    </app-regular-table>
  `,
  styles: ``,
  standalone: true,
})
export class ReservationPage implements OnInit, OnDestroy {
  private reservationService = inject(ReservationService);
  private formService = inject(PopupFormService);
  protected pagedData$ = new BehaviorSubject<Page<DtoDisplayDataMap>>({
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
  private lastParams = {} as FetchParams

  ngOnInit() {
    this.sub = this.reservationService.reservationDtos$.subscribe();
    this.fetchData({});
}

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  protected fetchData(params: FetchParams) {
    this.lastParams = { ...this.lastParams, ...params };

    const page = this.lastParams.event?.pageIndex || 0;
    const size = this.lastParams.event?.pageSize || 10;


    this.sub?.unsubscribe();
    this.sub = this.reservationService.findBy(
      this.lastParams.event,
      page,
      size,
      this.lastParams.sort,
      this.lastParams.searchCriteria
    ).subscribe((p: Page<ReservationDto>) => {

      const mapDtoToDisplayData = (res: ReservationDto): ReservationDisplayData => {
        return {
          checkin: res.checkin,
          checkout: res.checkout,
          stringUser: `${res.guest?.firstname || ''} ${res.guest?.lastname || ''}`.trim(),
          camperPlaceIndex: res.camperPlace?.index ?? '',
          reservationStatus: res.reservationStatus!,
          paid: res.paid
        } as ReservationDisplayData;
      }

      const mappedContent: DtoDisplayDataMap[] = p.content.map(res => ({ dto: res, displayData: mapDtoToDisplayData(res) } as DtoDisplayDataMap));

      const displayPage: Page<DtoDisplayDataMap> = {
        ...p,
        content: mappedContent
      };
      this.pagedData$.next(displayPage);
      this.paginatorLength = displayPage.totalElements;
    });
  }

  protected getPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
  }

  protected openFormPopup(reservation?: ReservationDto) {
    const reservationFd: ReservationFormData = {reservation: reservation};
    this.formService.openReservationFormPopup(reservationFd).afterClosed().subscribe(refreshed => {
      if (refreshed) {
        this.fetchData({});
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
export type ReservationDisplayData = {
  checkin: string,
  checkout: string,
  stringUser: string,
  camperPlaceIndex: string,
  reservationStatus: string,
  paid: boolean
}
