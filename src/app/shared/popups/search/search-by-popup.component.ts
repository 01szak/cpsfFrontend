import {Component, EventEmitter, inject, Output} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatHint, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormButtonsComponent} from '@shared/ui/buttons/form-buttons.component';
import {SearchCriteria} from '../../../api';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepickerToggleIcon
} from '@angular/material/datepicker';
import {DateDelimiter, DateFormater} from '@shared/helper/DateFormater';
import {DASH} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-search-by-popup',
  imports: [
    MatDialogActions,
    MatInput,
    MatDialogTitle,
    MatLabel,
    MatFormField,
    FormsModule,
    FormButtonsComponent,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerToggleIcon,
    MatSuffix,
    ReactiveFormsModule
  ],
  template: `
    <div class="content">
      <p class="tittle" mat-dialog-title>Szukaj</p>
      <mat-dialog-actions>
        <div class="searchDialogAction">
            <mat-label>{{ data.label }}</mat-label>
            @switch (data.type) {
              @case ('checkbox') {
                <input matInput type="text" placeholder="Wpisz 'tak' lub 'nie'" [(ngModel)]="value">
              }
              @case ('text') {
                <mat-form-field>
                  <input matInput
                         [type]="data.type"
                         [(ngModel)]="value"
                  >
                </mat-form-field>
              }
              @case ('date') {
                <div class="dateFilter">
                  <div class="datepickerWrapper">
                    <mat-form-field>
                      <input matInput [matDatepicker]="from" placeholder="Od" [(ngModel)]="value">
                      <mat-datepicker #from ></mat-datepicker>
                      <mat-datepicker-toggle matIconSuffix [for]="from">
                        <i class="fa-solid fa-calendar" style="font-size: large" matDatepickerToggleIcon></i>
                      </mat-datepicker-toggle>
                    </mat-form-field>
                  </div>
                  <div class="datepickerWrapper">
                    <div class="datepickerWrapper">
                      <mat-form-field>
                        <input matInput [matDatepicker]="to" placeholder="Do" [(ngModel)]="secondValue">
                        <mat-datepicker #to ></mat-datepicker>
                        <mat-datepicker-toggle matIconSuffix [for]="to">
                          <i class="fa-solid fa-calendar" style="font-size: large" matDatepickerToggleIcon></i>
                        </mat-datepicker-toggle>
                      </mat-form-field>
                    </div>
                  </div>
                </div>
              }
              @default {

              }
            }
          <app-form-buttons
            secondButtonText="Szukaj"
            [firstAction]="firstAction"
            [secondAction]="secondAction">
          </app-form-buttons>
        </div>
      </mat-dialog-actions>
    </div>
  `,
  styles: `
    matInput {
      flex-shrink: 1;
    }

    mat-label {
      margin-bottom: 10px;
    }

    .tittle {
      margin-top: 10px;
    }

    .datepickerWrapper, .dateFilter {
      display: flex;
      flex-direction: row;
    }

    .datepickerWrapper {
        border: 1px solid var(--primary);
        border-radius: 8px;
    }
    .dateFilter {
      justify-content: center;
      width: 100%;
      flex-shrink: 1;
      gap: 10px;
    }
    .mat-mdc-form-field {
      width: 100% !important;
      max-width: 150px !important;
      max-height: 65px;
    }

    .searchDialogAction {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-self: center;
      padding: 0;
    }

    .content {
      width: 100%;
      max-width: 350px;
    }

    p {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      font-size: large !important;
      width: 100%;
      padding: 0 10px 0 10px;
      text-align: center;
      height: 40px;
    }

    mat-dialog-actions {
      padding: 5px 20px;
    }

    app-form-buttons {
      flex-shrink: 0;
      width: 100%;
      margin: 10px 0 10px 0;
    }
  `
})
export class SearchByPopupComponent {

  @Output() criteriaEmitter: EventEmitter<SearchCriteria> = new EventEmitter<SearchCriteria>();

  private readonly dialogRef = inject(MatDialogRef<SearchByPopupComponent, SearchDialogData>);
  protected data = inject<SearchDialogData>(MAT_DIALOG_DATA);

  firstAction = () => this.close();
  secondAction = () => this.searchBy();

  value: string = '';
  secondValue: string = '';

  close() {
    this.dialogRef.close();
  }

  searchBy() {
    let operation = 'EQUALS'
    switch (this.data.type) {
      case ('text'): {
        operation = 'LIKE';
        break;
      }
      case ('date'): {
        this.value = DateFormater.YYYYMMDD(this.value, DateDelimiter.DASH);
        this.secondValue = DateFormater.YYYYMMDD(this.secondValue, DateDelimiter.DASH);
        operation = 'BETWEEN';
        break
      }
      default: break;
    }
    this.criteriaEmitter.emit({
      key: this.data.by,
      value: this.value,
      secondValue: this.secondValue,
      operation: operation as "EQUALS" | "NOT_EQUALS" | "LESS_THEN" | "GREATER_THEN" | "BETWEEN" | "LIKE"
    });
  }

}

export interface SearchDialogData {
  label: string,
  by: string,
  type: string,
  service: any
}
