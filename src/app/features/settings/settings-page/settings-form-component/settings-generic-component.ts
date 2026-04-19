import { Component, inject, Input, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BackendEntity } from '@core/models/BackendEntity';
import { Subscription } from 'rxjs';
import { FormButtonsComponent } from '@shared/ui/buttons/form-buttons.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import {
  MatExpansionPanel,
  MatExpansionPanelActionRow, MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatButton} from '@angular/material/button';

export type FormFieldDeclaration =
  | {
      columnDef: string;
      headerName: string;
      rowType: 'select';
      selectData: any[] | null;
      displayKey?: string;
      compareFunc?: (a: any, b: any) => boolean;
      onValueChange?: (newValue: any, group: FormGroup) => void;
    }
  | {
      columnDef: string;
      headerName: string;
      rowType: 'input';
      valueType: 'number' | 'text';
      onValueChange?: (newValue: any, group: FormGroup) => void;
    };

export interface RowChange<T> {
  original: T;
  updated: T;
}

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
    FormButtonsComponent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelActionRow,
    MatExpansionPanelDescription,
    MatButton
  ],
  templateUrl: './settings-generic-component.html',
  styleUrl: './settings-generic-component.css'
})
export class SettingsGenericComponent<T extends BackendEntity> implements OnDestroy {

  @Input() displayedColumns: string[] = [];
  @Input() formName: string = '';
  @Input() addNewFunc!: () => any;
  @Input() deleteFunc?: (deleteObj: any) => any;

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

  @Output() saveRequest = new EventEmitter<RowChange<T>[]>();

  private _data: T[] | null = [];
  private dataFromLastState: T[] = [];
  private sub = new Subscription();
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  protected dataSource: any[] = [];

  @Input() set data(d: T[] | null) {
    this._data = d;
    if (d && d.length > 0) {
      this.dataFromLastState = JSON.parse(JSON.stringify(d));
      this.rebuildForm(d);
    } else {
      this.dataFromLastState = [];
      this.rows.clear();
      this.dataSource = [];
    }
  }

  get data() {
    return this._data;
  }

  protected form = this.fb.group({
    rows: this.fb.array([])
  });

  get formChanged() {
    return this.rows.dirty || this.getChanges().length > 0;
  }

  get rows() {
    return this.form.get('rows') as FormArray;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public reset = () => {
    this.rows.controls.forEach((control, i) => {
      control.reset({ ...this.dataFromLastState[i] });
    });
    this.rows.markAsPristine();
    this.form.markAsPristine();
  };

  protected onSaveClick = () => {
    const changes = this.getChanges();
    if (changes.length > 0) {
      this.saveRequest.emit(changes);
    }
  };

  protected defaultCompare = (a: any, b: any) => (a && b ? a.id === b.id : a === b);

  private rebuildForm(data: T[]) {
    this.sub.unsubscribe();
    this.sub = new Subscription();
    this.rows.clear();

    data.forEach((item) => {
      const group = this.createGroup(item);

      this.formDeclaration.forEach(field => {
        if (field.onValueChange) {
          const control = group.get(field.columnDef);
          if (control) {
            this.sub.add(
              control.valueChanges.subscribe(val => {
                field.onValueChange!(val, group);
              })
            );
          }
        }
      });

      this.rows.push(group);
    });

    this.rows.markAsPristine();
    this.form.markAsPristine();

    this.dataSource = [...this.rows.controls];
    this.cdr.detectChanges();
  }

  private createGroup(item: any): FormGroup {
    const group: any = {};
    if ('id' in item) {
      group['id'] = new FormControl(item.id);
    }

    this.formDeclaration.forEach(field => {
      const key = field.columnDef;
      const value = item[key];
      group[key] = new FormControl(value);
    });

    return this.fb.group(group);
  }

  private getChanges(): RowChange<T>[] {
    const changes: RowChange<T>[] = [];
    this.rows.controls.forEach((control, index) => {
      if (control.dirty) {
        changes.push({
          original: this.dataFromLastState[index],
          updated: control.value as T
        });
      }
    });
    return changes;
  }

  private getChangedRows(): T[] {
    return this.rows.controls
      .filter((control) => control.dirty)
      .map((control) => control.value);
  }

}
