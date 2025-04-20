import {Component, numberAttribute, OnInit} from '@angular/core';
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
import {MatNativeDateModule} from '@angular/material/core';
import {MatCard} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {CamperPlaceService} from '../../../service/CamperPlaceService';
import {CamperPlace} from '../calendar/CamperPlace';
import {switchAll, switchMap} from 'rxjs';


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
    MatCard,
    MatCheckbox
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
  standalone: true
})
export class ReservationsComponent implements OnInit {

  displayedColumns: string[] = ['no', 'checkin', 'checkout', 'guest', 'camperPlace', 'status', 'paid'];
  allReservations: Array<Reservation> = [];
  searchValue = '';
  searchForm!: FormGroup;
  isAsc: number = 0;
  camperPlace:CamperPlace = {
    id: 0, index: "", price: "", reservations: [], type: ""

  }
  constructor(private reservationService: ReservationService, private popupService: PopupService, private fb: FormBuilder,private camperPlaceService:CamperPlaceService) {
    this.searchForm = this.fb.nonNullable.group({
      searchValue: '',
    })
  }

  fetchData() {
    this.reservationService.getFilteredReservations(this.searchValue).subscribe({
      next: (reservations) => {
        this.allReservations = reservations;
        console.log(this.allReservations)
this.allReservations.forEach(r =>{
  console.log(r.paid)
})
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

  openUpdatePopup(reservation: Reservation,camperPlace:CamperPlace) {
    this.popupService.openUpdateReservationPopup(reservation,camperPlace);
  }

  checkStatus(reservation: Reservation) {
    return reservation.reservationStatus.toLowerCase();

  }

  sorTable(header: string) {
    return this.reservationService.sortTable(header, this.isAsc).subscribe({
      next: (reservation) => {
        this.allReservations = reservation;
        if (this.isAsc === 0) {
          this.isAsc = 1;
        } else {
          this.isAsc = 0;
        }
      }
    })
  }

  setIsPaid(id: number, paid: boolean, camperPlaceIndex: string,checkin: Date, checkout: Date) {
    this.camperPlaceService.findCamperPlaceByIndex(camperPlaceIndex).pipe(
      switchMap(cp => {
        this.camperPlace = cp;
        console.log(this.camperPlace);

        const reservation = {
          id: id,
          checkin: new Date(checkin ).toISOString().split('T')[0],
          checkout: new Date(checkout ).toISOString().split('T')[0],
          camperPlace: this.camperPlace,
          paid: paid
        };

        console.log(reservation.paid);
        return this.reservationService.updateReservation(reservation);
      })
    ).subscribe({
      error: (err) => {
        console.log(id)
        console.log(err);
      }
    });
  }

}

