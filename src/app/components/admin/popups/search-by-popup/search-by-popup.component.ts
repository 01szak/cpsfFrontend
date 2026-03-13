import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {FormButtonsComponent} from '../../form-buttons/form-buttons.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YY',
  },
  display: {
    dateInput: 'DD.MM.YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    MatDatepickerModule,
    MatSuffix
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
    provideMomentDateAdapter(MY_FORMATS),
  ],
  templateUrl: './search-by-popup.component.html',
  styleUrl: './search-by-popup.component.css'
})
export class SearchByPopupComponent {

  readonly dialogRef = inject(MatDialogRef<SearchByPopupComponent, SearchDialogData>);

  data = inject<SearchDialogData>(MAT_DIALOG_DATA);

  firstAction = () => this.close();
  secondAction = () => this.searchBy();

  value: any = '';

  close() {
    this.dialogRef.close();
  }

  searchBy() {
    let searchValue = this.value;
    
    if (this.data.type === 'date' && moment.isMoment(this.value)) {
      searchValue = this.value.format('YYYY-MM-DD');
    }

    this.dialogRef.close({
      by: this.data.by,
      value: searchValue
    });
  }

}

export interface SearchDialogData {
  label: string,
  by: string,
  type: string,
  service: any
}
