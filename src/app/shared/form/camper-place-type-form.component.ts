import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgTemplateOutlet } from '@angular/common';
import { PopupFormContainer } from './popup-form-container.component';
import { CamperPlaceTypeService } from '@features/settings/services/CamperPlaceTypeService';
import { CamperPlaceType } from '@core/models/CamperPlaceType';
import { FormFactoryService } from '@shared/form/FormFactoryService';
import {PopupConfirmationService} from '@core/services/PopupConfirmationService';

export type CamperPlaceTypeFormData = { camperPlaceType?: CamperPlaceType };

@Component({
  selector: 'app-camper-place-type-form-popup',
  imports: [
    PopupFormContainer,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    NgTemplateOutlet,
  ],
  standalone: true,
  template: `
    <ng-template #formFields>
      <form [formGroup]="formGroup">
        <mat-form-field>
          <mat-label>Nazwa</mat-label>
          <input type="text" matInput formControlName="typeName">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Cena</mat-label>
          <input type="number" matInput formControlName="price">
        </mat-form-field>
      </form>
    </ng-template>

      <app-popup-form-container
        [formTitle]="formTitle"
        [deleteAction]="deleteAction"
        [isUpdate]="isUpdate"
        [proceedAction]="onSave">
        <ng-container *ngTemplateOutlet="formFields"></ng-container>
      </app-popup-form-container>
  `,
})
export class CamperPlaceTypeFormComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  private readonly camperPlaceTypeService = inject(CamperPlaceTypeService);
  private readonly factory = inject(FormFactoryService);
  private readonly dialogRef = inject(MatDialogRef<CamperPlaceTypeFormComponent>, { optional: true });
  private readonly fd: CamperPlaceTypeFormData = inject<CamperPlaceTypeFormData>(MAT_DIALOG_DATA, { optional: true }) || {};
  private readonly confirmation = inject(PopupConfirmationService);

  protected isUpdate = !!this.fd?.camperPlaceType;
  protected formTitle = this.isUpdate ? 'Edytuj Rodzaj' : 'Nowy Rodzaj';

  protected deleteAction = this.isUpdate ? () => {
    this.camperPlaceTypeService.delete(this.fd.camperPlaceType!).subscribe(() => this.dialogRef?.close());
  } : null;

  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.factory.buildCamperPlaceTypeForm();
      if (this.fd?.camperPlaceType) {
        this.formGroup.patchValue(this.fd.camperPlaceType);
      }
    }
  }

  protected onSave = () => {
    if (this.formGroup.invalid) return;

    const payload = this.formGroup.value;
    const action$ = this.camperPlaceTypeService.create(payload);

    this.confirmation.openConfirmationPopup({
      title: 'Zapisywanie',
      message: 'Czy chcesz zapisać zmiany?',
      action: () => (action$.subscribe(() => {this.dialogRef?.close()}))
    });
  }
}
