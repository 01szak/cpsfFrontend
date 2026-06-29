import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {ReservationService, ReservationStatus} from '@features/reservations/services/ReservationService';
import {PopupFormService} from '@core/services/PopupFormService';
import {
  DtoDisplayDataMap,
  FetchParams,
  Field,
  RegularTableComponent,
} from '@shared/ui/data-table/regular-table.component';
import {ReservationFormData} from '@shared/form/reservation-form.component';
import {BehaviorSubject, map, Subscription, take} from 'rxjs';
import {Page} from '@core/models/Page';
import {ReservationDto} from '../../../api';
import {CamperPlaceService} from '@features/settings/services/CamperPlaceService';

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
      [tabColumns]="fields"
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationPage implements OnInit, OnDestroy {
  private reservationService = inject(ReservationService);
  private camperPlaceService = inject(CamperPlaceService);
  private formService = inject(PopupFormService);
  protected pagedData$ = new BehaviorSubject<Page<DtoDisplayDataMap>>({
    content: [],
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0
  });

  protected fields: Field[] = [
    {name: 'checkin', type: 'DATE', value: ''},
    {name: 'checkout', type: 'DATE', value: ''},
    {name: 'guest', type: 'OBJECT', innerFields: [{type: "TEXT", displayName: 'Imie', name: 'firstname', value: ''}, {type: "TEXT", displayName: 'Nazwisko', name: 'lastname', value: ''}]},
    {name: 'camperPlace', type: 'OBJECT', innerFields: [{type: "NUMBER", displayName: 'Indeks', name: 'index', selectOption: this.getCamperPlaceIndexesForOptions(), value: ''}]},
    {name: 'reservationStatus', type: 'STATUS', value: '', selectOption: ["ACTIVE", "COMING", "EXPIRED"] as ReservationStatus[] },
    {name: 'paid', type: 'BOOLEAN', value: ''}
  ];
  protected displayedColumns = ['Wjazd', 'Wyjazd', 'Gość', 'Parcela', 'Status', 'Opłacone'];

  protected paginatorLength = 0;
  protected pageSize = 10;
  protected pageSizeOptions = [10, 20, 50, 100];
  protected paginator?: MatPaginator;

  private sub?: Subscription;
  private lastParams = {} as FetchParams

  public ngOnInit() {
    this.sub = this.reservationService.reservationDtos$.subscribe();
    this.fetchData({});
}

  public ngOnDestroy() {
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
          guest: `${res.guest?.firstname || ''} ${res.guest?.lastname || ''}`.trim(),
          camperPlace: res.camperPlace?.index ?? '',
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

  private getCamperPlaceIndexesForOptions(): string[] {
    const indexes: string[] = [];
    this.camperPlaceService.getCamperPlaces()
      .pipe(
        map(camperPlaces => camperPlaces.map(c => c.index!)),
        take(1)
      ).subscribe(c => {
          indexes.push(...c)
    });
    return indexes;
  }
}
export type ReservationDisplayData = {
  checkin: string,
  checkout: string,
  guest: string,
  camperPlace: string,
  reservationStatus: string,
  paid: boolean
}
