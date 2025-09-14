import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {FormButtonsComponent} from '../../new/form-buttons/form-buttons.component';
import {FormData} from '../../new/popup-form/popup-form.component';
import {NewReservationService} from '../../new/serviceN/NewReservationService';
import {NewUserService} from '../../new/serviceN/NewUserService';

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
  templateUrl: './search-by-popup.component.html',
  styleUrl: './search-by-popup.component.css'
})
export class SearchByPopupComponent {

  readonly dialogRef = inject(MatDialogRef<SearchByPopupComponent, SearchDialogData>);

  data = inject<SearchDialogData>(MAT_DIALOG_DATA);

  firstAction = () => this.close();
  secondAction = () => this.searchBy();

  value: string = '';

  close() {
    this.dialogRef.close();
  }

  searchBy() {
    const service = this.data.service;
    this.dialogRef.close({
      by: this.data.by,
      value: this.value
    });

    // service.findAll(undefined, 0, 0, undefined, this.data.searchBy, this.value);
  }

}

export interface SearchDialogData {
  label: string,
  by: string,
  type: string,
  service: any
}
