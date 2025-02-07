import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ReservationService} from '../../../service/ReservationService';
import {Reservation} from '../calendar/Reservation';
import {NgForOf} from '@angular/common';
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
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {FormsModule} from '@angular/forms';
import {PopupService} from '../../../service/PopupService';


@Component({
  selector: 'reservations',
  imports: [
    NgForOf,
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
    FormsModule
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
  standalone: true
})
export class ReservationsComponent implements AfterViewInit {

  displayedColumns: string[] = ['no', 'checkin', 'checkout', 'guest', 'camperPlace', 'status'];
  allReservations: Array<Reservation> = [];
  dataSource = new MatTableDataSource<Reservation>();

  @ViewChild(MatSort) sort!: MatSort;


  constructor(private reservationService: ReservationService,private popupService: PopupService) {
  }
  ngOnInit() {
    this.loadAllReservation();

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  openPopup(){
    this.popupService.openReservationPopup();
  }


  loadAllReservation() {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.allReservations = data;
        this.dataSource.data = data;
        console.log(data);
        data.forEach((d) =>{
          console.log(d.status)
        })
      }
    })
  }

  applyFilter(value: string) {
    if (!value) {
      return this.allReservations;
    }
    let filterValue = value.toLowerCase() || "";

    return this.allReservations.filter(reservation => {
//TODO
    })

  }
}




