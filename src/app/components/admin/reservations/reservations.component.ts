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
import {MatSort, MatSortHeader, Sort} from '@angular/material/sort';
import {FormsModule} from '@angular/forms';
import {PopupService} from '../../../service/PopupService';
import {subscribeToWorkflow} from '@angular/cli/src/command-builder/utilities/schematic-workflow';


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
  sortedData: Reservation[];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private reservationService: ReservationService, private popupService: PopupService) {
    this.sortedData = this.dataSource.data.slice();
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === "") {
      this.sortedData = data;
      return;
    }
    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'checkin':
          return compare(new Date(a.checkin).getTime(), new Date(b.checkin).getTime(), isAsc)
        case 'checkout':
          return compare(new Date(a.checkout).getTime(), new Date(b.checkout).getTime(), isAsc);
        case 'guest':
          return compare(a.userLastName.toLowerCase() ?? '', b.userLastName?.toLowerCase() ?? '', isAsc);
        case 'camperPlace':
          return compare(a.camperPlaceNumber ?? '', b.camperPlaceNumber ?? '', isAsc);
        case 'status':
          return compare(a.status ?? '', b.status ?? '', isAsc);
        default:
          return 0

      }
    })

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      if (a === b) {
        return 0;
      }
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
  }


  ngOnInit() {
    const data = this.dataSource.data.slice();

    this.loadAllReservation();

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  openPopup() {
    this.popupService.openReservationPopup();
  }


  loadAllReservation() {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.allReservations = data;
        this.dataSource.data = data;

        if (this.sort) {
          this.sortData({active: 'checkin', direction: 'desc'})
        }
        data.forEach((d) => {
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




