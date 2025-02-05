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
    MatSort
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


  constructor(private reservationService: ReservationService) {
  }

  ngOnInit() {
    this.loadAllReservation();

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }


  // sortData(sort: Sort) {
  //   const data = [...this.allReservations];
  //   if (!sort.active || sort.direction === '') {
  //     this.sortedData = data;
  //     return;
  //   }
  //   this.sortedData = data.sort((a, b) => {
  //     const isAsc = sort.direction === 'asc'
  //     switch (sort.active) {
  //       case 'no':
  //         return compare(this.allReservations.indexOf(a) || 0, this.allReservations.indexOf(b) || 0, isAsc);
  //       case 'checkin':
  //       case 'checkout':
  //         return compare(new Date(a[sort.active]).getTime(), new Date(b[sort.active]).getTime(), isAsc);
  //       case 'camperPlace':
  //         return compare(a.camperPlace.number || 0, b.camperPlace.number || 0, isAsc);
  //       case 'guest':
  //         return compare(a.guest.lastName, b.guest.lastName, isAsc);
  //       case 'status':
  //         return compare(a.status, b.status, isAsc)
  //       default:
  //         return 0;
  //     }
  //   })
  //
  //   function compare(a: number | string, b: number | string, isAsc: boolean) {
  //     return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  //   }
  // }


  loadAllReservation() {

    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.allReservations = data;
        this.dataSource.data = data;
        console.log(data);
      }
    })
  }
}




