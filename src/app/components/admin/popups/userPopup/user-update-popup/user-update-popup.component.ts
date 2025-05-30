import {Component, Inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgForOf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {User} from '../../../calendar/User';
import {UserService} from '../../../../../service/UserService';
import {MatCheckbox} from '@angular/material/checkbox';
import {ConfirmationService} from '../../confirmation/confirmation.component';

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
    MatCheckbox,
    MatHint
  ],
  templateUrl: './user-update-popup.component.html',
  standalone: true,
  styleUrl: './user-update-popup.component.css'
})
export class UserUpdatePopupComponent {
  updatedUser!: User;
  errorMessage:string = "";
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) protected user: User,
    private userService:UserService,
    private confirmationService: ConfirmationService,
  ) {}

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
  deleteUser(id:number) {
    this.confirmationService.performAction('Delete').subscribe(confirmation => {
      if (confirmation) {
        this.userService.deleteUserById(id).subscribe({
            next:() =>{
              window.location.reload()
            },
            error:(err) =>{
              console.log(err)
            }
          }
        );
      }
    })
  }
  updateUser() {
    this.confirmationService.performAction('Update').subscribe(confirmation => {
      if (confirmation) {
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

          },error:(err)=>{
            this.errorMessage = err.error || 'Unexpected error...'
          }
        })
    }
    })
  }

}
