import {
  Component,
  inject, Input,
} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Guest} from '@core/models/Guest';
import {FormButtonsComponent} from '@shared/ui/buttons/form-buttons.component';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import moment from 'moment';

@Component({
  imports: [
    FormsModule,
    MatDialogContent,
    MatDialogTitle,
    FormButtonsComponent,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogActions,
  ],
  selector: 'app-popup-form-container',
  standalone: true,
  styles: `
  mat-dialog-content {
    gap: 1rem;
    padding: 1.5rem !important;
    max-height: 60vh;
    color: #ffffff !important;
  }
  .deleteIcon {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
  }
  .deleteIcon i {
    color: #ffffff !important;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0.5rem;
    border-radius: var(--radius-sm);
    background: rgba(239, 68, 68, 0.72);
  }
  .deleteIcon i:hover {
    background: rgb(239, 68, 68);
  }
  h2[mat-dialog-title] {
    margin: 0;
    text-align: center;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary) !important;
    padding: 1rem !important;
  }
  app-form-buttons {
    display: block;
    padding: 1rem 1.5rem;
    background: rgba(255, 255, 255, 0.02);
    border-top: 1px solid var(--border-color);
  }
  `,
  template: `
    @if (isUpdate && deleteAction) {
      <div class="deleteIcon">
        <i (click)="deleteAction()" class="fa-regular fa-trash-can"></i>
      </div>
    }
    <h2 mat-dialog-title>{{ formTitle }}</h2>
    <mat-dialog-content>
      <ng-content></ng-content>
    </mat-dialog-content>
    <mat-dialog-actions>
      <app-form-buttons
        [firstAction]="closeAction"
        [secondAction]="proceedAction"
      />
    </mat-dialog-actions>
  `,
})
export class PopupFormContainer {

  @Input() formTitle!: string;
  @Input() proceedAction!: () => void;
  @Input() deleteAction!: (() => void) | null;
  @Input() isUpdate!: boolean;

  private readonly popupFormRef = inject(MatDialogRef<PopupFormContainer, FormData>);
  protected closeAction = () => this.popupFormRef.close();

}
export interface FormData {
  header: string,
  update?: boolean,
  objectToUpdate?: any,
  formInputs: FormInput[],
  startAt: moment.Moment | null;
}

export interface FormInput {
  name: string,
  field: string,
  type: string,
  select?: boolean,
  selectList?: Observable<any[]>,
  checkbox?: boolean
  defaultValue?: string | Date | number | Guest | boolean
  readonly?: boolean,
  additional?: boolean
  replacedByAdditional?: boolean
  autocomplete?: boolean;
}
