import {Component, Input} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

import {MatCheckbox} from '@angular/material/checkbox';
import {StatusComponent} from './status/status.component';
import {NgClass} from '@angular/common';


@Component({
  selector: 'app-regular-table',
  imports: [
    MatTable,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatPaginator,
    MatCheckbox,
    StatusComponent,
    NgClass
  ],
  templateUrl: './regular-table.component.html',
  styleUrl: './regular-table.component.css'
})
export class RegularTableComponent<T> {
  @Input() dataSource: any[] = [];
  @Input() tabColumns: column[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() pageSize: number = 0;
  @Input() pageSizeOptions: number[] = [];
  @Input() fetchFunc!: ($event: PageEvent) => any;
  @Input() onClickFunc!: (t:T) => any;
  @Input() createFunc!: () => any;
  @Input() additionalFunc!: (t:T) => any;

  get columnFields(): string[] {
    return this.tabColumns.map(col => col.field);
  }

}
export type column = { type: string, field: string }
