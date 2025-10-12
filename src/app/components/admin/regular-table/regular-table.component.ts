import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

import {MatCheckbox} from '@angular/material/checkbox';
import {StatusComponent} from './status/status.component';
import {AsyncPipe, NgClass} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {SearchByPopupComponent} from '../popups/search-by-popup/search-by-popup.component';
import {fromEvent, Observable} from 'rxjs';
import {Page} from '../new/InterfaceN/Page';
import {BackendEntity} from '../new/InterfaceN/BackendEntity';


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
    NgClass,
    AsyncPipe,
  ],
  templateUrl: './regular-table.component.html',
  styleUrl: './regular-table.component.css',
})
export class RegularTableComponent<T extends BackendEntity> {

  @Input() public page$!: Observable<Page<T>>;
  @Input() public tabColumns: column[] = [];
  @Input() public displayedColumns: string[] = [];
  @Input() public pageSize: number = 0;
  @Input() public pageSizeOptions: number[] = [];
  @Input() public serviceInstance: any = {};
  @Input() public fetchFunc!: ($event: PageEvent) => any;
  @Input() public onClickFunc!: (t:T) => any;
  @Input() public createFunc!: () => any;
  @Input() public additionalFunc?: (t:T) => any;

  @Output() public sortInfo = new EventEmitter<Sort>();
  @Output() public filterInfo = new EventEmitter<Filter>();

  private readonly dialog = inject(MatDialog)

  protected isArrowAsc: boolean = false;
  protected isClicked: boolean = false;
  protected clickCount: number = 0;
  protected clickedColumn: string = '';

  protected get columnFields(): string[] {
    return this.tabColumns.map(col => col.field);
  }

  protected click(columnField: string) {
     this.isArrowAsc = !this.isArrowAsc;
     this.clickedColumn = columnField;

     if (this.clickCount++ > 3) {
       this.clickCount = 0;
       this.isClicked = false;
       this.sendSortInfo();
     } else {
       this.sendSortInfo(columnField, this.isArrowAsc);
       this.clickCount = this.clickCount + 1;
       this.isClicked = true;
     }
  }


  protected sendSortInfo(columnName?: string, directionB?: boolean) {
    if (columnName === undefined || directionB === undefined) {
      this.sortInfo.emit();
    } else {
      const sort: Sort = {columnName: columnName, direction: directionB ? 'asc' : 'desc'}
      this.sortInfo.emit(sort);
    }
  }

  protected sendFilterInfo(by: string, value: string) {
    const filter: Filter = {by: by, value: value}
    this.filterInfo.emit(filter);
  }

  protected openSearchDialog(event: MouseEvent,label: string, by: string, type: string) {
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
