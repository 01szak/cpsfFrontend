import {Component} from '@angular/core';
import {ReservationService} from '../../../service/ReservationService';
import {Reservation} from '../calendar/Reservation';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'reservations',
  imports: [
    NgForOf
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
  standalone: true
})
export class ReservationsComponent {
  allReservations: Array<Reservation> = []
  constructor(private reservationService: ReservationService) {
  }

  ngOnInit() {
    this.loadAllReservation();
  }

  loadAllReservation() {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.allReservations = data;
        console.log(data);
      }
    })
  }

  protected readonly JSON = JSON;
}
