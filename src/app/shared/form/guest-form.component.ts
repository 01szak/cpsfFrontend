import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCardTitle } from '@angular/material/card';
import { NgTemplateOutlet } from '@angular/common';
import { PopupFormContainer } from './popup-form-container.component';
import { UserService } from '@features/users/services/UserService';
import { Guest } from '@core/models/Guest';
import { FormFactoryService } from '@core/services/FormFactoryService';

export type GuestFormData = { guest?: Guest };

@Component({
  selector: 'app-guest-form',
  imports: [
    PopupFormContainer,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    NgTemplateOutlet,
  ],
  standalone: true,
  styles: `
    form {
      color: var(--text-primary);
      display: flex;
      flex-direction: column;
    }
  `,
  template: `
    <ng-template #formFields>
      <form [formGroup]="formGroup">
        <mat-form-field>
          <mat-label>Imię</mat-label>
          <input type="text" matInput formControlName="firstname">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Nazwisko</mat-label>
          <input type="text" matInput formControlName="lastname">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input type="email" matInput formControlName="email">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Nr Telefonu</mat-label>
          <input type="tel" matInput formControlName="phoneNumber">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Rejestracja</mat-label>
          <input type="text" matInput formControlName="carRegistration">
        </mat-form-field>
      </form>
    </ng-template>

    @if (isDialog) {
      <app-popup-form-container [formTitle]="formTitle" [deleteAction]="deleteAction" [isUpdate]="isUpdate">
        <ng-container *ngTemplateOutlet="formFields"></ng-container>
      </app-popup-form-container>
    } @else {
      <ng-container *ngTemplateOutlet="formFields"></ng-container>
    }
  `,
})
export class GuestFormComponent implements OnInit {
  @Input() isDialog = true;
  @Input() formGroup!: FormGroup; // Przekazywane z góry

  private readonly userService = inject(UserService);
  private readonly fd: GuestFormData = inject<GuestFormData>(MAT_DIALOG_DATA, { optional: true }) || {};

  protected isUpdate = !!this.fd?.guest;
  protected formTitle = this.isUpdate ? 'Edytuj Gościa' : 'Nowy Gość';
  protected deleteAction = this.isUpdate ? () => this.userService.delete(this.fd.guest!) : null;

  ngOnInit() {
    // Jeśli to dialog i nie mamy formGroup, budujemy własny (dla niezależnego edytora gości)
    if (!this.formGroup) {
      const factory = inject(FormFactoryService);
      this.formGroup = factory.buildGuestForm();
      if (this.fd?.guest) {
        this.formGroup.patchValue(this.fd.guest);
      }
    }
  }
}
