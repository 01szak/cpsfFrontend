import {
  Component, ElementRef,
  inject, Input, OnChanges, OnInit,
  SimpleChanges, ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {distinctUntilChanged, filter, fromEvent, map, Observable, of, startWith, switchMap, tap} from 'rxjs';
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
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule,
  ],
  selector: 'app-popup-form',
  standalone: true,
  styleUrl: './popup-form.component.css',
  templateUrl: './popup-form.component.html',
})
export class PopupFormComponent implements OnInit {

  @ViewChild('select', {static: false}) select!: MatSelect;
  @ViewChild('input', {static: false}) input!: ElementRef;

  readonly popupFormRef = inject(MatDialogRef<PopupFormComponent, FormData>);
  readonly formData = inject<FormData>(MAT_DIALOG_DATA);

  formValues: Record<string, any> = {};
  firstAction = () => this.close();
  secondAction = () => this.submit();
  userList: { name: string, user: UserN }[] = [];
  additionalFieldsCheckbox: boolean = false;
  inputValue: string = '';

  constructor(
    protected popupConfirmationService: PopupConfirmationService,
    protected reservationService: NewReservationService,
    protected userService: NewUserService,
  ) {}

  ngOnInit() {
    for (const input of this.formData.formInputs) {
      const value = input.defaultValue;
      if (input.checkbox === true) {
        this.formValues[input.field] = !!value
      } else {
        this.formValues[input.field] =
          value instanceof Date ? value.toLocaleDateString('en-CA') : value?.toString() ?? '';
      }
    }
  }

  onInputChange() {
    if (this.inputValue.length < 2 || this.inputValue.length > 15) return;
    this.userService.findAll(undefined, 0, 100, undefined, {
      by: 'fullName',
      value: this.inputValue
    })
      .pipe(
        map(e =>
          e.content.map(u => ({
            name: u.firstName + ' ' + u.lastName,
            user: u
          }))
        )
      )
      .subscribe(list => {
        this.userList = list;
        if (list.length > 0) {
          setTimeout(() => this.select?.open());
        }
      });
  }


  onOptionSelected(event: MatSelectChange, formField: any) {
      this.inputValue = event.value.name;
      this.formValues[formField] = event.value.user
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
      this.inputValue = '';

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
