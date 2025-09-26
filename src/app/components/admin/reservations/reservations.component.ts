import { Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {ReservationN} from './../new/InterfaceN/ReservationN';
import {NewReservationService} from '../new/serviceN/NewReservationService';
import {PopupFormService} from '../new/serviceN/PopupFormService';
import {Filter, RegularTableComponent, Sort} from '../regular-table/regular-table.component';
import {Observable, of} from 'rxjs';


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
  standalone: true
})
export class ReservationsComponent implements OnInit {

  columns:  {type: string, field: string }[] = [
    {type: 'date',field: 'checkin'},
    {type: 'date',field: 'checkout'},
    {type: 'text',field: 'stringUser'},
    {type: 'text',field: 'camperPlaceIndex'},
    {type: 'status',field: 'reservationStatus'},
    {type: 'checkbox',field: 'paid'},
    ]
  displayedColumns: string[] = ['Wjazd', 'Wyjazd', 'Gość', 'Parcela', 'Status', 'Opłacone'];

  reservations$!: Observable<ReservationN[]>;

  allReservations: ReservationN[] = []
  pageSize: number = 0;
  pageSizeOptions: number[] = [10, 20, 50, 100, 150]

  sortInfo!: Sort;
  filterInfo!: Filter;
  event?: PageEvent;
  page: number|undefined = 0;
  size: number|undefined = 0

  constructor(
    protected reservationServiceN: NewReservationService,
    protected formService: PopupFormService,
  ) {
  }

  ngOnInit() {
    this.reservations$ = this.reservationServiceN.reservations$;
    this.reservationServiceN.findAll(undefined, 0, 10);
  }

  getSortInfo(sort: Sort) {
    this.sortInfo = sort;
    this.fetchData(this.event, this.page, this.size);
  }
  getFilterInfo(filter: Filter) {
    this.filterInfo = filter
    this.fetchData(undefined, 0, 10, );
  }

  fetchData(event?: PageEvent, page?: number, size?: number) {
    if (event) this.event = event;
    if (page !== undefined) this.page = page;
    if (size !== undefined) this.size = size;
    this.reservationServiceN.findAll(
      this.event,
      this.page,
      this.size,
      this.sortInfo,
      this.filterInfo
    );
  }

  openCreatePopup() {
    this.formService.openCreateReservationFormPopup();
  }
  setIsPaid(r: ReservationN) {
    r.paid = !r.paid
    this.reservationServiceN.updateReservation(r);
  }

  openUpdatePopup(reservation: ReservationN) {
    this.formService.openUpdateReservationFormPopup(reservation);
  }

}

