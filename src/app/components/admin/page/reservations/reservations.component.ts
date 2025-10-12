import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {ReservationN} from '../../new/InterfaceN/ReservationN';
import {NewReservationService} from '../../new/serviceN/NewReservationService';
import {PopupFormService} from '../../new/serviceN/PopupFormService';
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
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
  standalone: true,
})
export class ReservationsComponent extends BaseTablePage<ReservationN, NewReservationService> implements OnInit, OnDestroy {

  constructor(
    protected reservationService: NewReservationService,
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
    this.additionalFunc =  (r: ReservationN) => {
      r.paid = !r.paid;
      this.reservationService.updateReservation(r).subscribe();
    };
  };

  ngOnInit() {
    super.fetchData(this.event, this.page, this. size);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  protected override openCreatePopup() {
    this.formService.openCreateReservationFormPopup();
  }

  protected override openUpdatePopup(reservation: ReservationN) {
    this.formService.openUpdateReservationFormPopup(reservation);
  }

}

