import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {Reservation} from '../../../Interface/Reservation';
import {ReservationService} from '../../../../service/ReservationService';
import {PopupFormService} from '../../../../service/PopupFormService';
import {RegularTableComponent} from '../../regular-table/regular-table.component';
import {BaseTablePage} from '../BaseTablePage';

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

  protected override openCreatePopup() {
    this.formService.openCreateReservationFormPopup();
  }

  protected override openUpdatePopup(reservation: Reservation) {
    this.formService.openUpdateReservationFormPopup(reservation);
  }


}

