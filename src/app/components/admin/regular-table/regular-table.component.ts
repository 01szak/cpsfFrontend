import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
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
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SearchByPopupComponent} from '../popups/search-by-popup/search-by-popup.component';
import {fromEvent} from 'rxjs';



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
  @Input() serviceInstance: any = {};
  @Input() fetchFunc!: ($event: PageEvent) => any;
  @Input() onClickFunc!: (t:T) => any;
  @Input() createFunc!: () => any;
  @Input() additionalFunc!: (t:T) => any;

  @Output() sortInfo = new EventEmitter<Sort>();
  @Output() filterInfo = new EventEmitter<Filter>();

  readonly dialog = inject(MatDialog)

  isArrowAsc: boolean = false;
  isClicked: boolean = false;
  clickCount: number = 0;
  clickedColumn: string = '';

  get columnFields(): string[] {
    return this.tabColumns.map(col => col.field);
  }

  click(columnField: string) {
     this.isArrowAsc = !this.isArrowAsc;
     this.clickedColumn = columnField;

     if (this.clickCount ++ > 3) {
       this.clickCount = 0;
       this.isClicked = false;
       this.sendSortInfo();
     } else {
       this.sendSortInfo(columnField, this.isArrowAsc);
       this.clickCount = this.clickCount + 1;
       this.isClicked = true;
     }
  }

  sendSortInfo(columnName?: string, directionB?: boolean) {
    if (columnName === undefined || directionB === undefined) {
      this.sortInfo.emit();
    } else {
      const sort: Sort = {columnName: columnName, direction: directionB ? 'asc' : 'desc'}
      this.sortInfo.emit(sort);
    }
  }
  sendFilterInfo(by: string, value: string) {
    const filter: Filter = {by: by, value: value}
    this.filterInfo.emit(filter);
  }

  openSearchDialog(event: MouseEvent,label: string, by: string, type: string) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const service = this.serviceInstance;

    const dialogRef =
      this.dialog.open(SearchByPopupComponent, {
          position: {
          top: `${rect.bottom + window.scrollY}px`,
          left: `${rect.left + window.scrollX}px`
        },
        panelClass: 'searchDialog',
        hasBackdrop: false,
        data: {label, by, type, service},
      });

    const clickSub = fromEvent(document, 'click').subscribe((event: Event) => {
      const targetEl = event.target as HTMLElement;
      if (!target.contains(targetEl) && !document.querySelector('.searchDialog')?.contains(targetEl)) {
        dialogRef.close();
        clickSub.unsubscribe();
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendFilterInfo(result.by, result.value)
      }
    })
  }

}
export type column = { type: string, field: string }
export interface Sort {columnName: string, direction: 'asc' | 'desc' }
export interface Filter {by: string,value: string}
