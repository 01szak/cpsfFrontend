import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {Reservation} from '@core/models/Reservation';
import {ReservationService} from '@features/reservations/services/ReservationService';
import {PopupFormService} from '@core/services/PopupFormService';
import {RegularTableComponent} from '@shared/ui/data-table/regular-table.component';
import {BaseTablePage} from '@shared/base/BaseTablePage';
import {ReservationFormData} from '@shared/form/reservation-form.component';

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
export class ReservationPage extends BaseTablePage<Reservation, ReservationService> implements OnInit, OnDestroy {

  constructor(
    protected reservationService: ReservationService,
    protected override formService: PopupFormService
  ) {
    super(reservationService);
    this.formService = formService;
    this.columns = [
      {type: 'date',field: 'checkin'},
      {type: 'date',field: 'checkout'},
      {type: 'text',field: 'stringUser'},
      {type: 'text',field: 'camperPlaceIndex'},
      {type: 'status',field: 'reservationStatus'},
      {type: 'checkbox',field: 'paid'}
    ];
    this.displayedColumns = ['Wjazd', 'Wyjazd', 'Gość', 'Parcela', 'Status', 'Opłacone'];

    this.additionalFunc =  (r: Reservation) => {
      let previousPaidStaus = r.paid;
      r.paid = !r.paid;
      this.reservationService.updateReservation(r).subscribe( {
        error: () => r.paid = previousPaidStaus
      });
    };
  };

  ngOnInit() {
    super.fetchData(this.event, this.page, this. size);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  protected override openFormPopup(reservation?: Reservation) {
    const reservationFd: ReservationFormData = {reservation: reservation}
    this.formService.openReservationFormPopup(reservationFd);
  }

}

