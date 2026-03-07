import { Component, inject, Input, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BackendService } from '../../../../../service/BackendService';
import { BackendEntity } from '../../../../Interface/BackendEntity';
import { Subscription } from 'rxjs';
import { FormButtonsComponent } from '../../../form-buttons/form-buttons.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

export type FormFieldDeclaration =
  | {
      columnDef: string;
      headerName: string;
      rowType: 'select';
      selectData: any[] | null;
      displayKey?: string;
      compareFunc?: (a: any, b: any) => boolean;
    }
  | {
      columnDef: string;
      headerName: string;
      rowType: 'input';
      valueType: 'number' | 'text';
    };

@Component({
  selector: 'app-settings-form-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormButtonsComponent
  ],
  templateUrl: './settings-form.component.html',
  styleUrl: './settings-form.component.css'
})
export class SettingsFormComponent<T extends BackendEntity> implements OnDestroy {
  @Input() displayedColumns: string[] = [];
  
  private _formDeclaration: FormFieldDeclaration[] = [];
  @Input() set formDeclaration(f: FormFieldDeclaration[]) {
    this._formDeclaration = f;
    if (this._data && this._data.length > 0) {
      this.rebuildForm(this._data);
    }
  }
  get formDeclaration() {
    return this._formDeclaration;
  }

  @Input() service!: BackendService<T>;

  private _data: T[] | null = [];
  private dataFromLastState: T[] = [];
  private sub = new Subscription();
  private fb = inject(FormBuilder);

  @Input() set data(d: T[] | null) {
    this._data = d;
    if (d && d.length > 0) {
      this.dataFromLastState = JSON.parse(JSON.stringify(d));
      this.rebuildForm(d);
    } else {
      this.dataFromLastState = [];
      this.rows.clear();
    }
  }

  get data() {
    return this._data;
  }

  protected form = this.fb.group({
    rows: this.fb.array([])
  });

  get formChanged() {
    return this.getChangedRows().length > 0;
  }

  get rows() {
    return this.form.get('rows') as FormArray;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  protected reset = () => {
    this.rows.controls.forEach((control, i) => {
      control.reset({ ...this.dataFromLastState[i] });
    });
    this.form.markAsPristine();
  };

  protected update = () => {
    const changedRows = this.getChangedRows();
    if (this.service && changedRows.length > 0) {
      this.sub.add(
        this.service.update(changedRows).subscribe({
          next: () => {
            this.dataFromLastState = JSON.parse(JSON.stringify(this.rows.value));
            this.rows.controls.forEach((c) => c.markAsPristine());
            this.form.markAsPristine();
          },
          error: () => {
            this.reset();
          }
        })
      );
    }
  };

  protected defaultCompare = (a: any, b: any) => (a && b ? a.id === b.id : a === b);

  private rebuildForm(data: T[]) {
    this.rows.clear();
    data.forEach((item) => {
      this.rows.push(this.createGroup(item));
    });
  }

  private createGroup(item: any): FormGroup {
    const group: any = {};
    Object.keys(item).forEach((key) => {
      const value = item[key];
      const isSelect = this.formDeclaration.find((f) => f.columnDef === key && f.rowType === 'select');

      if (!isSelect && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        group[key] = this.createGroup(value);
      } else {
        group[key] = new FormControl(value);
      }
    });
    return this.fb.group(group);
  }

  private getChangedRows(): T[] {
    return this.rows.controls
      .filter((control) => control.dirty)
      .map((control) => control.value);
  }
}

