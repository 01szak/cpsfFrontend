import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {CamperPlaceForTable} from '../../../../Interface/CamperPlaceForTable';
import {FormArray, FormBuilder, ReactiveFormsModule, ValueChangeEvent} from '@angular/forms';
import {Subscription} from 'rxjs';
import {CamperPlaceService} from '../../../../../service/CamperPlaceService';
import {CamperPlaceType} from '../../../../Interface/CamperPlaceType';
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatFooterRow,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormButtonsComponent} from '../../../form-buttons/form-buttons.component';

@Component({
  selector: 'app-camper-place-form',
  imports: [
    ReactiveFormsModule,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatFormField,
    MatInput,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatSelect,
    MatOption,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    FormButtonsComponent,
  ],
  templateUrl: './camper-place-form.component.html',
  styleUrl: './camper-place-form.component.css'
})
export class CamperPlaceFormComponent implements OnInit, OnDestroy {

  @Input() set camperPlaces(value: CamperPlaceForTable[] | null) {
    this._camperPlaces = value;
    if (this._camperPlaces) {
      this.camperPlaceFormLastState = this._camperPlaces;
      this.buildForm();
    }
  }

  get camperPlaces() {
    return this._camperPlaces;
  }

  @Input() set camperPlaceTypes(value: CamperPlaceType[] | null) {
    this._camperPlaceTypes = value;
    if (this._camperPlaceTypes) {
      this.buildForm();
    }
  }

  get camperPlaceTypes() {
    return this._camperPlaceTypes;
  }

  private sub = new Subscription();
  private formBuilder = inject(FormBuilder);
  private _camperPlaces: CamperPlaceForTable[] | null = null;
  private _camperPlaceTypes: CamperPlaceType[] | null = null;
  private camperPlaceFormLastState:CamperPlaceForTable[] = [];

  protected readonly displayedColumns = ["index", "type", "price"];
  protected camperPlaceForm = this.formBuilder.group({
    rows: this.formBuilder.array([])
  });

  get formChanged() {
    return this.getChangedRows().length > 0;
  }

  constructor(private camperPlaceService: CamperPlaceService) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  protected reset = () => {
    this.rows.controls.forEach((control, i) => {
      control.reset({ ...this.camperPlaceFormLastState[i]});
    });
  }

  protected update = () => {
    const changedRows = this.getChangedRows();
    this.sub.add(
      this.camperPlaceService.update(changedRows).subscribe({
        next: () => {
          this.camperPlaceFormLastState = this.rows.value;
          this.buildForm();

          this.rows.controls.forEach(c => c.markAsPristine());
          this.camperPlaceForm.markAsPristine();
        },
        error: () => {this.reset();}
      })
    );
  };

  protected get rows() {
    return this.camperPlaceForm.get('rows') as FormArray;
  }

  protected compareTypes = (a: CamperPlaceType, b: CamperPlaceType) => a && b && a.id === b.id;

  private buildForm() {
    const rows = this.camperPlaceForm.get('rows') as FormArray;

    if (this.rows.length <= 0) {
      this.camperPlaceFormLastState.forEach(() => {
        this.rows.push(
          this.formBuilder.group({
            id: [],
            index: [],
            type: [],
            price: [],
          })
        );
      });
    }
    rows.patchValue(this.camperPlaceFormLastState);
    console.log(rows.controls)
  }

  private getChangedRows(): CamperPlaceForTable[] {
    return this.rows.controls
      .filter(control => control.dirty)
      .map(control => control.value);
  }

}
