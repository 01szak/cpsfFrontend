import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {FormButtonsComponent} from '@shared/ui/buttons/form-buttons.component';

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
    this.dialogRef.close({
      by: this.data.by,
      value: this.value
    });
  }

}

export interface SearchDialogData {
  label: string,
  by: string,
  type: string,
  service: any
}
