import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgTemplateOutlet, CommonModule } from '@angular/common';
import { PopupFormContainer } from './popup-form-container.component';
import { CamperPlaceService } from '@features/settings/services/CamperPlaceService';
import { FormFactoryService } from '@shared/form/FormFactoryService';
import { CamperPlaceDto } from '../../api/models/camper-place-dto';
import { MatSelectModule } from '@angular/material/select';
import { CamperPlaceTypeService } from '@features/settings/services/CamperPlaceTypeService';

export type CamperPlaceFormData = { camperPlace?: CamperPlaceDto };

@Component({
  selector: 'app-camper-place-form',
  imports: [
    PopupFormContainer,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    NgTemplateOutlet,
    MatSelectModule,
    CommonModule
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
          <mat-label>Indeks</mat-label>
          <input type="text" matInput formControlName="index">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Rodzaj</mat-label>
          <mat-select formControlName="type" [compareWith]="compareFn">
            @for (type of camperPlaceTypes$ | async; track type.id) {
              <mat-option [value]="type">{{ type.typeName }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Cena</mat-label>
          <input type="number" matInput formControlName="price">
        </mat-form-field>
      </form>
    </ng-template>

    @if (isDialog) {
      <app-popup-form-container
        [formTitle]="formTitle"
        [deleteAction]="deleteAction"
        [isUpdate]="isUpdate"
        [proceedAction]="onSave">
        <ng-container *ngTemplateOutlet="formFields"></ng-container>
      </app-popup-form-container>
    } @else {
      <ng-container *ngTemplateOutlet="formFields"></ng-container>
    }
  `,
})
export class CamperPlaceFormComponent implements OnInit {
  @Input() isDialog = true;
  @Input() formGroup!: FormGroup;

  private readonly camperPlaceService = inject(CamperPlaceService);
  private readonly camperPlaceTypeService = inject(CamperPlaceTypeService);
  private readonly factory = inject(FormFactoryService);
  private readonly dialogRef = inject(MatDialogRef<CamperPlaceFormComponent>, { optional: true });
  private readonly fd: CamperPlaceFormData = inject<CamperPlaceFormData>(MAT_DIALOG_DATA, { optional: true }) || {};

  protected camperPlaceTypes$ = this.camperPlaceTypeService.camperPlaceType$;
  protected isUpdate = !!this.fd?.camperPlace;
  protected formTitle = this.isUpdate ? 'Edytuj Parcelę' : 'Nowa Parcela';

  protected deleteAction = this.isUpdate ? () => {
    this.camperPlaceService.delete(this.fd.camperPlace!).subscribe(() => this.dialogRef?.close(true));
  } : null;

  ngOnInit() {
    if (!this.formGroup) {
      this.formGroup = this.factory.buildCamperPlaceForm();
      if (this.fd?.camperPlace) {
        this.formGroup.patchValue(this.fd.camperPlace);
      }
    }
  }

  protected compareFn(o1: any, o2: any): boolean {
    return (o1 && o2) ? (o1.id == o2.id) : (o1 === o2);
  }

  protected onSave = () => {
    if (this.formGroup.invalid) return;

    const payload = this.formGroup.value as CamperPlaceDto;
    if (this.isUpdate) {
        payload.id = this.fd.camperPlace?.id;
    }

    const action$ = this.isUpdate
      ? this.camperPlaceService.update(payload)
      : this.camperPlaceService.create(payload);

    action$.subscribe(() => {
      this.dialogRef?.close(true);
    });
  }
}
