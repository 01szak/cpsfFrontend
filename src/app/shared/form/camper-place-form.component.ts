import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { PopupFormContainer } from './popup-form-container.component';
import { CamperPlaceService } from '@features/settings/services/CamperPlaceService';
import { CamperPlaceTypeService } from '@features/settings/services/CamperPlaceTypeService';
import { CamperPlaceForTable } from '@core/models/CamperPlaceForTable';
import { FormFactoryService } from '@shared/form/FormFactoryService';
import { CamperPlaceType } from '@core/models/CamperPlaceType';
import {PopupConfirmationService} from '@core/services/PopupConfirmationService';

export type CamperPlaceFormData = { camperPlace?: CamperPlaceForTable };

@Component({
  selector: 'app-camper-place-form-popup',
  imports: [
    PopupFormContainer,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    NgTemplateOutlet,
    AsyncPipe
  ],
  standalone: true,
  template: `
    <ng-template #formFields>
      <form [formGroup]="formGroup">
        <mat-form-field>
          <mat-label>Indeks</mat-label>
          <input type="text" matInput formControlName="index" [placeholder]="'Ustaw domyślny'">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Rodzaj</mat-label>
          <mat-select formControlName="type" [compareWith]="compareFn">
            @for (type of (camperPlaceTypes$ | async); track type.id) {
              <mat-option [value]="type">{{ type.typeName }}</mat-option>
            }
          </mat-select>
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
export class CamperPlaceFormComponent implements OnInit {
  @Input() formGroup!: FormGroup;

  private readonly camperPlaceService = inject(CamperPlaceService);
  private readonly camperPlaceTypeService = inject(CamperPlaceTypeService);
  private readonly factory = inject(FormFactoryService);
  private readonly dialogRef = inject(MatDialogRef<CamperPlaceFormComponent>, { optional: true });
  private readonly fd: CamperPlaceFormData = inject<CamperPlaceFormData>(MAT_DIALOG_DATA, { optional: true }) || {};
  private readonly confirmation = inject(PopupConfirmationService);

  protected isUpdate = !!this.fd?.camperPlace;
  protected formTitle = this.isUpdate ? 'Edytuj Parcelę' : 'Nowa Parcela';

  protected camperPlaceTypes$ = this.camperPlaceTypeService.getCamperPlaceTypes();

  protected deleteAction = this.isUpdate ? () => {
    this.camperPlaceService.delete(this.fd.camperPlace!).subscribe(() => this.dialogRef?.close());
  } : null;

  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.factory.buildCamperPlaceForm();
      if (this.fd?.camperPlace) {
        this.formGroup.patchValue(this.fd.camperPlace);
      }
    }

    this.formGroup.get('type')?.valueChanges.subscribe((newType: CamperPlaceType) => {
      if (newType && 'price' in newType) {
        this.formGroup.get('price')?.setValue(newType.price, { emitEvent: false });
        this.formGroup.markAsDirty();
      }
    });
  }

  protected compareFn(o1: any, o2: any): boolean {
    return (o1 && o2) ? (o1.id == o2.id) : (o1 === o2);
  }

  protected onSave = () => {
    if (this.formGroup.invalid) return;

    const payload = this.formGroup.value;
    const action$ = this.camperPlaceService.create(payload);

    this.confirmation.openConfirmationPopup({
      title: 'Zapisywanie',
      message: 'Czy chcesz zapisać zmiany?',
      action: () => (action$.subscribe(() => {this.dialogRef?.close()}))
    });

  }
}
