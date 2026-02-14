import {
  Component, ElementRef,
  inject, OnInit,
 ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {map, Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {PopupConfirmationService} from '../../../../service/PopupConfirmationService';
import {ReservationService} from '../../../../service/ReservationService';
import {Guest} from '../../../Interface/Guest';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {FormButtonsComponent} from '../../form-buttons/form-buttons.component';
import {AsyncPipe} from '@angular/common';
import {UserService} from '../../../../service/UserService';
import { MatSelectModule } from '@angular/material/select';
import {Reservation} from '../../../Interface/Reservation';

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
  deleteRes = (r: Reservation) => {
    this.reservationService.deleteReservation(r)
  }
  guestList: { name: string, guest: Guest }[] = [];
  additionalFieldsCheckbox: boolean = false;
  inputValue: string = '';

  constructor(
    protected popupConfirmationService: PopupConfirmationService,
    protected reservationService: ReservationService,
    protected userService: UserService,
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
          e.content.map(g => ({
            name: g.firstname + ' ' + g.lastname,
            guest: g
          }))
        )
      )
      .subscribe(list => {
        this.guestList = list;
        if (list.length > 0) {
          setTimeout(() => this.select?.open());
        }
      });
  }


  onOptionSelected(event: MatSelectChange, formField: any) {
      this.inputValue = event.value.name;
      this.formValues[formField] = event.value.guest
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

  deleteObject(objectToUpdate: any) {
    let deleteFunc: () => void;
    let message: string = '';

    if ('checkin' in objectToUpdate) {
      message = 'Rezerwacja zostanie usunięta. Czy chcesz kontynuować?';
      deleteFunc = () => this.reservationService.deleteReservation(objectToUpdate).subscribe();
      this.popupConfirmationService.openConfirmationPopup(message, deleteFunc);
    }else if ('firstname' in objectToUpdate) {
      message = 'Gość zostanie usunięty a z nim wszystkie jego rezerwacje (Może to wpłynąć na statystki, narazie nie zalecane!). Czy chcesz kontynuować?';
      deleteFunc = () => this.userService.delete(objectToUpdate).subscribe();
      this.popupConfirmationService.openConfirmationPopup(message, deleteFunc);
    } else {
      return;
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
  defaultValue?: string | Date | number | Guest | boolean
  readonly?: boolean,
  additional?: boolean
  replacedByAdditional?: boolean
  autocomplete?: boolean;
}
