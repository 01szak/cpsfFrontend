import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
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
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {FormButtonsComponent} from './../form-buttons/form-buttons.component';
import {AsyncPipe} from '@angular/common';
import {NewUserService} from '../serviceN/NewUserService';
import {CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

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
    MatOption,
    AsyncPipe,
    MatSelect,
    MatAutocomplete,
    MatAutocompleteTrigger,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll
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
    protected reservationService: NewReservationService,
    protected userService: NewUserService,
    private cdRef: ChangeDetectorRef
  ) {
  }

  formValues: Record<string, any> = {};
  firstAction = () => this.close();
  secondAction = () => this.submit();
  formControl = new FormControl('');
  filteredOptions: Observable<UserN[]> = new Observable<UserN[]>();
  userList: UserN[] = [];
  additionalFieldsCheckbox: boolean = false;

  ngOnInit() {
    for (const input of this.formData.formInputs) {
      const value = input.defaultValue;
      if (input.checkbox === true) {
        this.formValues[input.field] = !!value
      } else if (input.selectList && input.field === "user") {
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

  onOptionSelected(event: MatAutocompleteSelectedEvent | MatSelectChange, field: string) {
    if (event instanceof MatAutocompleteSelectedEvent) {
      this.formValues[field] = event.option.value
    } else {
      this.formValues[field] = event.value;
    }
  }

  close() {
    this.popupFormRef.close();
  }

  submit() {
    this.popupFormRef.close(this.formValues);
  }

  hasAdditional(formData: FormData) {
    return formData.formInputs.some(f => f.additional)
  }

  changeAfterCheck() {
    this.additionalFieldsCheckbox = !this.additionalFieldsCheckbox
    // if additional appear sets the value as undefined to prevent data overriding
    // disabled for update because default value is readonly
    if (!this.formData.update) {
      const index = this.formData.formInputs.findIndex(f => f.replacedByAdditional !== undefined);
      const inputToBeReplacedByAdditional = this.formData.formInputs[index].field;
      this.formValues[inputToBeReplacedByAdditional] = undefined
      this.formControl.setValue('');
    }
  }


  protected readonly console = console;

  checkInstance(objToUpdate: any): string {
   const secondKey = Object.keys(objToUpdate)[1];
    if (secondKey === 'checkin') {
      return 'r';
    }else if (secondKey === 'firstName') {
      return 'u'
    } else {
      return ''
    }

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
  replacedByAdditional?: boolean
  autocomplete?: boolean;
}
