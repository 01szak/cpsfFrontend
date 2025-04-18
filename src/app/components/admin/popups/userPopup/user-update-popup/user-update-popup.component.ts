import {Component, Inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgForOf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {User} from '../../../calendar/User';
import {UserService} from '../../../../../service/UserService';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-user-update-popup',
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    MatCheckbox
  ],
  templateUrl: './user-update-popup.component.html',
  standalone: true,
  styleUrl: './user-update-popup.component.css'
})
export class UserUpdatePopupComponent {
  updatedUser!: User;
  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) protected user: User, private userService:UserService) {
  }

  ngOnInit() {
    this.updatedUser = {
      id: this.user.id,
      carRegistration: this.user.carRegistration ?? "",
      city: this.user.city ?? "",
      country:this.user.country ?? "",
      email: this.user.email ?? "",
      firstName: this.user.firstName ?? "",
      lastName: this.user.lastName ?? "",
      phoneNumber:this.user.phoneNumber ?? "",
      reservations: this.user.reservations ?? "",
      streetAddress: this.user.streetAddress ?? ""
    };
  }
  closePopup() {
    this.dialog.closeAll();
  }
  deleteUser() {
    this.userService.deleteUserById(this.user.id);
    window.location.reload();
  }
  updateUser() {
    const reservationRequest = {
      id: this.updatedUser.id,
      firstName: this.updatedUser.firstName,
      lastName: this.updatedUser.lastName,
      carRegistration: this.updatedUser.carRegistration,
      city: this.updatedUser.city,
      country: this.updatedUser.country,
      email: this.updatedUser.email,
      phoneNumber: this.updatedUser.phoneNumber,
      reservations: this.updatedUser.reservations,
      streetAddress: this.updatedUser.streetAddress
    }
    this.userService.updateReservation(reservationRequest).subscribe({
      next: () => {
        console.log(reservationRequest)

        window.location.reload();
        this.closePopup();

      },error:()=>{
        console.log(reservationRequest)
      }
    })
  }

}
