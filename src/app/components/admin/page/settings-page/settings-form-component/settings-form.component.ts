import {Component, Inject, inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {BackendService} from '../../../../../service/BackendService';
import {BackendEntity} from '../../../../Interface/BackendEntity';
import {Subscription} from 'rxjs';
import {FormButtonsComponent} from '../../../form-buttons/form-buttons.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from '@angular/material/table';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-settings-form-component',
  imports: [
    FormButtonsComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatInput,
    MatOption,
    MatRow,
    MatRowDef,
    MatSelect,
    MatTable,
    ReactiveFormsModule,
    MatHeaderCellDef
  ],
  templateUrl: './settings-form.component.html',
  styleUrl: './settings-form.component.css'
})
export class SettingsFormComponent<T extends BackendEntity, S extends BackendService<T>> {

  @Input() displayedColumns!: string[];
  @Input() formDeclaration!: FormFieldDeclaration[];

  private formBuilder = inject(FormBuilder);
  private sub = new Subscription();
  private dataFromLastState: any[] = [];
  private _data: any[] | null = [];
  protected form = this.formBuilder.group({
    rows: this.formBuilder.array([])
  });

  private _service!: BackendService<T>;

  set service(service: BackendService<T>) {
    this._service = service;
  }

  get formChanged() {
    return this.getChangedRows().length > 0;
  }

  get data() {
    return this._data;
  }

  set data(d: any[] | null) {
    this._data = d;

    if (!d) return;

    this.dataFromLastState = d;

    this.rows.clear();

    d.forEach(row => {
      this.rows.push(this.createGroup(row));
    });
    this.rows.patchValue(d);
    console.log(this.rows.controls)

  }

  protected reset = () => {
    this.rows.controls.forEach((control, i) => {
      control.reset({ ...this.dataFromLastState[i]});
    });
  }

  protected update = () => {
    const changedRows = this.getChangedRows();

    this.sub.add(
      this._service.update(changedRows).subscribe({
        next: () => {
          this.dataFromLastState = this.rows.value;

          this.rows.controls.forEach(c => c.markAsPristine());
          this.form.markAsPristine();
        },
        error: () => { this.reset(); }
      })
    );
  };
  protected get rows() {
    return this.form.get('rows') as FormArray;
  }

  private createGroup(data: any): FormGroup {
    const group: any = {};
    Object.keys(data).forEach(key => {
      if (key === 'id') return;
      const value = data[key];
      group[key] =
        typeof value === 'object' && value !== null && !Array.isArray(value)
          ? this.createGroup(value)
          : new FormControl(value);
    });
    return this.formBuilder.group(group);
  }

  private getChangedRows() {
    return this.rows.controls
      .filter(control => control.dirty)
      .map(control => control.value);
  }

 protected defaultCompare = (a: any, b: any) => a === b;

  log(val: any) {
    console.log(val);
    return ''; // nic nie renderuje w HTML
  }
}

export type FormFieldDeclaration =
|{
    columnDef: string;
    headerName: string;
    rowType: 'select';
    selectData: any[];
    compareFunc?: (a:any, b:any) => boolean;
}
|{
  columnDef: string;
  headerName: string;
  rowType: 'input';
  valueType: 'number' | 'text';
};

