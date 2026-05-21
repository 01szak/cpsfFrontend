import {Component, EventEmitter, inject, Output} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {FormButtonsComponent} from '@shared/ui/buttons/form-buttons.component';
import {SearchCriteria} from '../../../api';

@Component({
  selector: 'app-search-by-popup',
  imports: [
    MatDialogActions,
    MatInput,
    MatDialogTitle,
    MatLabel,
    MatFormField,
    FormsModule,
    FormButtonsComponent
  ],
  template: `
    <div class="content">
      <p mat-dialog-title>Szukaj</p>
      <mat-dialog-actions>
        <div class="searchDialogAction">
          <mat-form-field>
            <mat-label>{{ data.label }}</mat-label>
            @if (data.type !== 'checkbox') {
              <input matInput
                     [type]="data.type"
                     [(ngModel)]="value">
            } @else {
              <input matInput type="text" placeholder="Wpisz 'tak' lub 'nie'" [(ngModel)]="value">
            }
          </mat-form-field>
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
    .searchDialogAction {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-self: center;
      padding: 0;
    }

    .content {
      min-width: 0 !important;
      width: 100% !important;
      box-sizing: border-box !important;
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

  close() {
    this.dialogRef.close();
  }

  searchBy() {
    let operation = 'EQUALS'
    if (this.data.type === 'text') {
      operation = 'LIKE';
    }
    this.criteriaEmitter.emit({
      key: this.data.by,
      value: this.value,
      operation: operation as 'EQUALS' | 'LIKE'
    });
  }

}

export interface SearchDialogData {
  label: string,
  by: string,
  type: string,
  service: any
}
