import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
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
  MatTable, MatTableDataSource,
} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PopupService} from '../../../service/PopupService';

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
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
  standalone: true
})
export class ReservationsComponent implements OnInit{

  displayedColumns: string[] = ['no', 'checkin', 'checkout', 'guest', 'camperPlace', 'status'];
  allReservations: Array<Reservation> = [];
  searchValue=  'empty';
  searchForm!: FormGroup;

  constructor(private reservationService: ReservationService, private popupService: PopupService, private fb: FormBuilder) {
  this.searchForm = this.fb.nonNullable.group({
    searchValue: '',
  })
  }

  fetchData() {
    this.reservationService.getFilteredReservations(this.searchValue).subscribe({
      next:(reservations)=>{
        this.allReservations = reservations;
      }
    })
  }
  ngOnInit() {
    this.fetchData();
  }

onSearchSubmit(){
    this.searchValue = this.searchForm.value.searchValue;
    this.fetchData();

}

  openPopup() {
    this.popupService.openReservationPopup();
  }


  checkStatus(reservation: Reservation) {
    return reservation.reservationStatus.toLowerCase();

  }

}

