import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {map, Observable, startWith} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {PopupConfirmationService} from './../serviceN/PopupConfirmationService';
import {NewReservationService} from './../serviceN/NewReservationService';
import {UserN} from './../InterfaceN/UserN';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatOption} from '@angular/material/select';
import {FormButtonsComponent} from './../form-buttons/form-buttons.component';
import {AsyncPipe} from '@angular/common';

@Component({
  imports: [
    MatFormField,
    MatInput,
    FormsModule,
    MatDialogContent,
    MatDialogTitle,
    FormButtonsComponent,
    MatLabel,
    MatCheckbox,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    AsyncPipe
  ],
  selector: 'app-popup-form',
  standalone: true,
  styleUrl: './popup-form.component.css',
  templateUrl: './popup-form.component.html',
})
export class PopupFormComponent implements OnInit {
  readonly popupFormRef = inject(MatDialogRef<PopupFormComponent, FormData>);
  readonly formData = inject<FormData>(MAT_DIALOG_DATA);
  constructor(
    protected popupConfirmationService: PopupConfirmationService,
    protected reservationService: NewReservationService
  ) {
  }

  formValues: Record<string, any> = {};
  firstAction = () => this.close();
  secondAction = () => this.submit();
  formControl = new FormControl('');
  filteredOptions: Observable<UserN[]> = new Observable<UserN[]>();
  userList: UserN[] = [];

  ngOnInit() {
    for (const input of this.formData.formInputs) {
      const value = input.defaultValue;
      if (input.checkbox === true) {
        this.formValues[input.field] = !!value
      }else if (input.selectList) {
        input.selectList.subscribe(users => {
            this.userList = users;
            this.filteredOptions = this.formControl.valueChanges.pipe(
              startWith(''),
              map(value => typeof value === 'string' ? value : this.userDisplay(value || '')),
              map(name => this.filterUsers(name))
            )
          }
        )

      } else {
        this.formValues[input.field] =
          value instanceof Date ? value.toLocaleDateString('en-CA') : value?.toString() ?? '';
      }
    }
  }
  private filterUsers(name: string): UserN[] {
    const filterValue = name.toLowerCase();
    return this.userList.filter(user =>
      (user.firstName + ' ' + user.lastName).toLowerCase().includes(filterValue)
    );
  }

  userDisplay(value: UserN | string): string {
    if (typeof value === 'string') {
      return value;
    }
    return value ? `${value.firstName} ${value.lastName}` : '';
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent, field: string) {
    this.formValues[field] = event.option.value;
  }

  close() {
    this.popupFormRef.close();
  }
  submit() {
    this.popupFormRef.close(this.formValues);
  }

}
export interface FormData {
  header: string,
  update?: boolean,
  objectToUpdate?: any
  formInputs: FormInput[],
}

export interface FormInput {
  name: string,
  field: string,
  type: string,
  select?: boolean,
  selectList?: Observable<any[]>,
  checkbox?: boolean
  defaultValue?: string | Date | number | UserN | boolean
  readonly?: boolean,
  additional?: boolean
}
