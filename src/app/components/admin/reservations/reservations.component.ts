import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {CamperPlaceService} from '../../../service/CamperPlaceService';
import {ReservationN} from './../new/InterfaceN/ReservationN';
import {NewReservationService} from '../new/serviceN/NewReservationService';
import {PopupFormService} from '../new/serviceN/PopupFormService';
import {RegularTableComponent} from '../regular-table/regular-table.component';


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
    {type: 'data',field: 'checkin'},
    {type: 'data',field: 'checkout'},
    {type: 'text',field: 'stringUser'},
    {type: 'text',field: 'camperPlaceIndex'},
    {type: 'status',field: 'reservationStatus'},
    {type: 'checkbox',field: 'paid'},
    ]
  displayedColumns: string[] = ['Wjazd', 'Wyjazd', 'Gość', 'Parcela', 'Status', 'Opłacone'];
  allReservations: ReservationN[] = []
  allReservationsSize: number = 0;
  pageSize: number = 0;
  pageSizeOptions: number[] = [12, 24, 50, 100]


  constructor(
    private reservationServiceN: NewReservationService,
    protected formService: PopupFormService,
  ) {
  }

  ngOnInit() {
    this.fetchData(undefined, 1, 12);
  }


  fetchData(event?: PageEvent, page?: number, size?: number) {
    this.reservationServiceN.findAll(
      event,
      event == undefined ? page : undefined,
      event == undefined ? size : undefined)
      .subscribe(p => {
      this.allReservations = p.content.map(r => {
        r.stringUser = r.user?.firstName + " " + r.user?.lastName  || '';

        return r;
      });
      this.allReservationsSize = p.totalElements;
      this.pageSize = 12;
      this.pageSizeOptions = this.pageSizeOptions.includes(p.totalElements)
        ? this.pageSizeOptions
        : [...this.pageSizeOptions, p.totalElements];
    })
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

