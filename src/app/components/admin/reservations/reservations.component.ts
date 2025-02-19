import { Component, OnInit} from '@angular/core';
import {ReservationService} from '../../../service/ReservationService';
import {Reservation} from '../calendar/Reservation';
import {CommonModule} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PopupService} from '../../../service/PopupService';
import { MatNativeDateModule } from '@angular/material/core';
import {MatCard} from '@angular/material/card';


@Component({
  selector: 'reservations',
  imports: [
    CommonModule,
    MatTable,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatPaginatorModule,
    MatSortHeader,
    MatSort,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatCard
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
  standalone: true
})
export class ReservationsComponent implements OnInit {

  displayedColumns: string[] = ['no', 'checkin', 'checkout', 'guest', 'camperPlace', 'status'];
  allReservations: Array<Reservation> = [];
  sortedReservations: Array<Reservation> = []
  searchValue = '';
  searchForm!: FormGroup;
  isAsc: number = 0;


  constructor(private reservationService: ReservationService, private popupService: PopupService, private fb: FormBuilder) {
    this.searchForm = this.fb.nonNullable.group({
      searchValue: '',
    })
  }

  fetchData() {
    this.reservationService.getFilteredReservations(this.searchValue).subscribe({
      next: (reservations) => {
        this.allReservations = reservations;
      }
    })
  }

  ngOnInit() {
    this.fetchData();
  }

  onSearchSubmit() {
    this.searchValue = this.searchForm.value.searchValue;
    this.fetchData();

  }

  openCreatePopup() {
    this.popupService.openCreateReservationPopup();
  }

  openUpdatePopup(reservation: Reservation) {
    this.popupService.openUpdateReservationPopup(reservation);
  }

  checkStatus(reservation: Reservation) {
    return reservation.reservationStatus.toLowerCase();

  }

  sorTable(header: string) {
    return this.reservationService.sortTable(header,this.isAsc).subscribe({
      next: (reservation) => {
        this.allReservations = reservation;
        if (this.isAsc === 0) {
          this.isAsc = 1;
        }else{
          this.isAsc = 0;
        }
      }
    })
  }

}

