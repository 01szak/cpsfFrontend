import {AfterViewInit, Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
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
import {StatusComponent} from '@shared/ui/data-table/status/status.component';
import {AsyncPipe, NgClass, CommonModule} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {SearchByPopupComponent} from '@shared/popups/search/search-by-popup.component';
import {fromEvent, Observable} from 'rxjs';
import {Page} from '@core/models/Page';
import {SearchCriteria} from '../../../api';


@Component({
  selector: 'app-regular-table',
  imports: [
    CommonModule,
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
  template: `
    @if ((page$ | async)?.content; as content) {
      <div class="tableDiv">
        <div class="tableContent">
          <table class="content" mat-table [dataSource]="content">
            <ng-container matColumnDef="no">
              <th mat-header-cell *matHeaderCellDef> Nr.</th>
              <td mat-cell *matCellDef="let column; let i = index">
                {{ i + 1 }}
              </td>
            </ng-container>

            @for (column of tabColumns; track column) {

              <ng-container [matColumnDef]="column.field">
                <th mat-header-cell *matHeaderCellDef
                    (click)="openSearchDialog($event, displayedColumns[$index], column.field, column.type)">
                  <div class="headerDiv">
                    <i class="fa-regular fa-circle-up"
                       [ngClass]="{
                        'ascArrow' : isArrowAsc,
                        'descArrow' : !isArrowAsc,
                        'arrowClicked' : isClicked && clickedColumn === column.field
                        }"
                       (click)="click(column.field);$event.stopPropagation()"></i>
                    <p class="sortingButton">{{ displayedColumns[$index] }}</p>
                  </div>
                </th>
                <td mat-cell *matCellDef="let element">

                  @if (column.type === 'checkbox') {
                    <mat-checkbox (change)=" additionalFunc?.(element.dto)" [checked]="element.dto[column.field]"
                                  (click)="$event.stopPropagation()"></mat-checkbox>
                  } @else if (column.type === 'status') {
                    <app-status [status]="element.displayData[column.field]"></app-status>
                  } @else {
                    {{ element.displayData[column.field] }}
                  }
                </td>
              </ng-container>
            }
            <tr mat-header-row *matHeaderRowDef="columnFields"></tr>
            <tr mat-row
                (click)="onClickFunc(row.dto)"
                [ngClass]="{
            'row': true
            }"
                *matRowDef="let row; let i = index; columns: columnFields">
            </tr>

          </table>
        </div>

        <div class="tableFooter">
          <div class="funcButtons">
            <i class="fa-solid fa-plus funcIcon" (click)="createFunc()"></i>
            <i class="fa-solid fa-arrow-rotate-left funcIcon" (click)="reset()"></i>
          </div>
          <mat-paginator
            [length]="paginatorLength"
            [pageSize]="pageSize"
            [pageSizeOptions]="pageSizeOptions"
            (page)="fetchFuncWithEvent($event)">
          </mat-paginator>
        </div>

      </div>
    }`,
  styles: `
    .tableDiv {
      margin: 1rem auto;
      width: calc(100% - 2rem);
      max-width: 1400px;
      background: var(--bg-main) !important;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: transparent;
    }

    td, th {
      padding: 0 1.5rem !important;
      height: 50px;
      text-align: left;
      color: var(--text-primary);
      white-space: nowrap;
      vertical-align: middle;
      border-bottom: 1px solid var(--border-color);
    }

    th {
      background: transparent;
      cursor: pointer;
      transition: background 0.2s;
    }

    th:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .headerDiv {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
    }

    .sortingButton {
      margin: 0;
    }

    .row {
      transition: all 0.2s ease;
      cursor: pointer;
      background-color: var(--bg-inner) !important;
    }

    .row:hover {
      background: rgba(139, 92, 246, 0.1) !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 5;
    }

    :host-context(.light-theme) {
      .tableDiv {
        background: var(--bg-inner) !important;
      }
      .row {
        background-color: var(--bg-card) !important;
      }
      .tableFooter {
        background: var(--bg-inner) !important;
      }
    }

    /* Scrollbar specific to table body */
    .tableDiv {
      height: 56vh;
      display: flex;
      flex-direction: column;
    }

    .tableContent {
      flex: 1;
      overflow-y: auto;
      overflow-x: auto;
    }

    .tableFooter {
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background: var(--bg-main);
      border-top: 1px solid var(--border-color);
    }

    .funcIcon {
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary);
      color: white;
      border-radius: var(--radius-sm);
      font-size: 1.25rem;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: var(--shadow-md);
    }

    .funcIcon:hover {
      background: var(--primary-hover);
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
    }

    /* Arrows */
    .ascArrow, .descArrow {
      font-size: 0.875rem;
      color: var(--text-muted);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .arrowClicked {
      color: var(--primary);
    }

    th {
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(8px);
    }

    .funcButtons {
      width: 100%;
      justify-content: start;
      display: flex;
      flex-direction: row;
      gap: 10px;
    }

  `,
})
export class RegularTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() public page$!: Observable<Page<DtoDisplayDataMap>>;
  @Input() public tabColumns: Column[] = [];
  @Input() public displayedColumns: string[] = [];
  @Input() public pageSize: number = 0;
  @Input() public pageSizeOptions: number[] = [];
  @Input() public serviceInstance: any = {};
  @Input() public paginatorLength: number = 0;
  @Input() public fetchFunc!: (params: FetchParams) => any;
  @Input() public onClickFunc!: (t: any) => any;
  @Input() public createFunc!: () => any;
  @Input() public additionalFunc?: (t: any) => any;

  @Output() public sortInfo = new EventEmitter<Sort>();
  @Output() public filterInfo = new EventEmitter<SearchCriteria>();
  @Output() paginatorReady = new EventEmitter<MatPaginator>();

  private readonly dialog = inject(MatDialog)

  protected isArrowAsc: boolean = false;
  protected isClicked: boolean = false;
  protected clickCount: number = 0;
  protected clickedColumn: string = '';

  ngAfterViewInit(): void {
    this.paginatorReady.emit(this.paginator);
  }

  protected fetchFuncWithEvent(event: PageEvent) {
    this.fetchFunc({event})
  }

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
      this.fetchFunc({sort: undefined});
    } else {
      const sort: Sort = {columnName: columnName, direction: directionB ? 'asc' : 'desc'}
      this.sortInfo.emit(sort);
      this.fetchFunc({sort});
    }
  }

  protected sendFilterInfo(criteria?: SearchCriteria) {
    this.filterInfo.emit(criteria);
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.fetchFunc({searchCriteria: criteria});
  }

  protected openSearchDialog(event: MouseEvent, label: string, by: string, type: string) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const service = this.serviceInstance;

    const dialogRef = this.dialog.open(SearchByPopupComponent, {
      position: {
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`
      },
      panelClass: 'searchDialog',
      hasBackdrop: false,
      data: { label, by, type, service },
    });

    const popupSub = dialogRef.componentInstance.criteriaEmitter.subscribe((criteria: SearchCriteria) => {
      this.sendFilterInfo(criteria);
    });

    const clickSub = fromEvent(document, 'click').subscribe((event: Event) => {
      const targetEl = event.target as HTMLElement;

      const isInsideDialog = !!targetEl.closest('.searchDialog');
      const isInsideDatePicker = !!targetEl.closest('.mat-datepicker-content') || !!targetEl.closest('.mat-calendar');
      const isInsideOrigin = target.contains(targetEl);

      if (!isInsideOrigin && !isInsideDialog && !isInsideDatePicker) {
        dialogRef.close();
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      clickSub.unsubscribe();
      popupSub.unsubscribe();
    });
  }

  protected reset() {
    this.isArrowAsc = false;
    this.isClicked = false;
    this.clickCount = 0;
    this.clickedColumn = '';
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.fetchFunc({event: undefined, sort: undefined, searchCriteria: undefined});
  }
}
export type DtoDisplayDataMap = {dto: any, displayData: any}
export type Column = { type: string, field: string }
export interface Sort {columnName: string, direction: 'asc' | 'desc' }
export type FetchParams = {event?: PageEvent, sort?: Sort, searchCriteria?: SearchCriteria}
