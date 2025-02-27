import {Component, OnInit} from '@angular/core';
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
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCard} from '@angular/material/card';
import {User} from '../calendar/User';
import {UserService} from '../../../service/UserService';
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
    MatNativeDateModule,
    MatCard
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  standalone: true
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['no', 'firstName', 'lastName', 'email','phoneNumber','carRegistration','address', 'hasReservation'];
  allUsers: Array<User> = [];
  sortedUsers: Array<User> = []
  searchValue = '';
  searchForm!: FormGroup;
  isAsc: number = 0;


  constructor(private userService: UserService, private fb: FormBuilder,private popupService: PopupService) {
    this.searchForm = this.fb.nonNullable.group({
      searchValue: '',
    })
  }

  fetchData() {
    this.userService.getFilteredUsers(this.searchValue).subscribe({
      next: (users) => {
        this.allUsers = users;
        console.log(users);
      }
    })
  }

  ngOnInit() {
    this.fetchData()
  }

  onSearchSubmit() {
    this.searchValue = this.searchForm.value.searchValue;
    this.fetchData();

  }

  hasReservation(user: User) {
    if (user.reservations.length > 0) {
      let nonExpiredReservationsCount = 0;
      user.reservations.forEach(r => {
        if (r.reservationStatus.toString() !== 'EXPIRED') {
          nonExpiredReservationsCount++;
        }
      })
      if(nonExpiredReservationsCount > 0){
        return 'YES';
      }
    }
    return 'NO';


  }



  openUpdatePopup(user: User) {
    this.popupService.openUpdateUserPopup(user);
  }


}
