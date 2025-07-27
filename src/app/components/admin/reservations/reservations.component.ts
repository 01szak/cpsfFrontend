import {Component, OnInit} from '@angular/core';
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
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PopupService} from '../../../service/PopupService';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCard} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {CamperPlaceService} from '../../../service/CamperPlaceService';
import {CamperPlace} from '../calendar/CamperPlace';
import {switchMap} from 'rxjs';
import {ReservationN} from './../new/InterfaceN/ReservationN';
import {NewReservationService, Page} from '../new/serviceN/NewReservationService';
import {PopupFormService} from '../new/serviceN/PopupFormService';


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
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatCard,
    MatCheckbox,
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
  standalone: true
})
export class ReservationsComponent implements OnInit {

  displayedColumns: string[] = ['no', 'checkin', 'checkout', 'guest', 'camperPlace', 'status', 'paid'];
  allReservations: ReservationN[] = []
  searchValue = '';
  searchForm!: FormGroup;
  isAsc: number = 0;
  allReservationsSize: number = 0;
  pageSize: number = 0;
  pageSizeOptions: number[] = [20, 50, 100]

  camperPlace:CamperPlace = {
    id: 0, index: "", price: "", reservations: [], type: ""

  }
  constructor(
    private reservationService: ReservationService,
    private reservationServiceN: NewReservationService,
    private popupService: PopupService,
    private fb: FormBuilder,
    private camperPlaceService: CamperPlaceService,
    private formService: PopupFormService,
  ) {
    this.searchForm = this.fb.nonNullable.group({
      searchValue: '',
    })
  }

  ngOnInit() {
    this.reservationServiceN.findAll(undefined,1,12).subscribe(p => {
      this.allReservations = p.content;
      console.log(this.allReservations);
      this.allReservationsSize = p.totalElements;
      this.pageSize = 12;
      this.pageSizeOptions = this.pageSizeOptions.includes(p.totalElements)
        ? this.pageSizeOptions
        : [...this.pageSizeOptions, p.totalElements];
    })
  }


  fetchData(event: PageEvent) {
//     this.reservationService.getFilteredReservations(this.searchValue).subscribe({
//       next: (reservations) => {
//         this.allReservations = reservations;
// this.allReservations.forEach(r =>{
// })
//       }
//     })
     this.reservationServiceN.findAll(event).subscribe(r => {
       this.allReservations = r.content;
    });
  }


  onSearchSubmit() {
    this.searchValue = this.searchForm.value.searchValue;
    // this.fetchData();

  }

  openCreatePopup() {
    this.formService.openCreateReservationFormPopup();
  }

  openUpdatePopup(reservation: ReservationN) {
    this.formService.openUpdateReservationFormPopup(reservation);
  }

  checkStatus(reservation: Reservation) {
    return reservation.reservationStatus.toLowerCase();

  }

  // sorTable(header: string) {
  //   return this.reservationService.sortTable(header, this.isAsc).subscribe({
  //     next: (reservation) => {
  //       this.allReservations = reservation;
  //       if (this.isAsc === 0) {
  //         this.isAsc = 1;
  //       } else {
  //         this.isAsc = 0;
  //       }
  //     }
  //   })
  // }

  setIsPaid(id: number, paid: boolean, camperPlaceIndex: string,checkin: Date, checkout: Date) {
    this.camperPlaceService.findCamperPlaceByIndex(camperPlaceIndex).pipe(
      switchMap(cp => {
        this.camperPlace = cp;
        const reservation = {
          id: id,
          checkin: new Date(checkin ).toISOString().split('T')[0],
          checkout: new Date(checkout ).toISOString().split('T')[0],
          camperPlace: this.camperPlace,
          paid: paid
        };

        return this.reservationService.updateReservation(reservation);
      })
    ).subscribe({
      error: (err) => {
      }
    });
  }

}

