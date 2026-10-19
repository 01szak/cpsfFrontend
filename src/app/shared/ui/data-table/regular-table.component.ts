import {
  Component,
  EventEmitter,
  inject,
  Input, OnInit,
  Output,
  ViewChild,
  WritableSignal
} from '@angular/core';
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
import {NgClass, CommonModule} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {SearchByPopupComponent} from '@shared/popups/search/search-by-popup.component';
import {fromEvent} from 'rxjs';
import {Pageable, SearchCriteria, SearchRequest} from '../../../api';
import {DateDelimiter, DateFormater} from '@shared/helper/DateFormater';
import {Moment} from 'moment';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatOption, MatSelect} from '@angular/material/select';

export interface Sort {
  columnName: string,
  direction: SortDirection
}

export interface SearchDialogData {
  label: string,
  by: string,
  field: Field,
  searchCriteriaSignal: WritableSignal<SearchRequest>
}

export interface Field {
  name: string,
  type: FieldType,
  displayName: string, //it is used for headers display
  value?: string | '', //there should be only one per instance, for inner fields one per field
  secondValue?: string, //used for operation: BETWEEN
  innerFields?: Field[], //for type object fields can be nested
  selectOption?: any[]
}

export interface PaginatorData {
  pageSize: number,
  totalElements: number
}

export type FieldType = 'DATE' | 'BOOLEAN' | 'TEXT' | 'OBJECT' | 'STATUS' | 'NUMBER';
export type SortDirection = 'ASC' | 'DESC';

export const DEFAULT_PAGEABLE: Pageable = {
  page: 0,
  size: 10,
  sort: []
}

export const DEFAULT_SEARCH_REQUEST: SearchRequest = {searchCriteria: []}
export const PAGE_SIZE_OPTIONS: number[] = [10, 20, 50, 100];

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
    MatProgressSpinner,
    MatSelect,
    MatOption,
  ],
  styles: `
    .tableDiv {
      margin: 1rem auto;
      width: 100%;
      height: 100%;
      border: 1px solid var(--border-color);
      /*box-shadow: var(--shadow-lg);*/
      /*overflow: hidden;*/
      display: flex;
      flex-direction: column;
    }

    /*table {*/
    /*  width: 100%;*/
    /*  border-collapse: collapse;*/
    /*  background: transparent;*/
    /*}*/

    td, th {
      height: 50px;
      text-align: left;
      color: var(--text-primary);
    }

    th {
      background: var(--bg-card);
      cursor: pointer;
      transition: background 0.2s;
    }

    th:hover {
      background: color-mix(in srgb, var(--bg-card), var(--text-primary) 8%);
    }

    .headerDiv {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sortingButton {
      margin: 0;
    }

    .row {
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .row:hover {
      background: rgba(139, 92, 246, 0.1) !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 5;
    }

    /*
      Table adapts to the container: on a page (auto height host) tableDiv keeps 56vh,
      inside a fixed height container (e.g. dashboard widget) it shrinks to fit and scrolls internally.
    */
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 0;
    }

    .tableDiv {
      flex: 0 1 56vh;
      min-height: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      margin: 0.5rem 0 0;
      height: auto;
    }

    .tableContent {
      flex: 1;
      overflow-y: auto;
      overflow-x: auto;
    }

    .tableFooter {
      /*flex-shrink: 0;*/
      display: flex;
      /*flex-direction: row;*/
      justify-content: space-between;
      padding: 5px ;
      /*background: var(--bg-main);*/
      /*border-top: 1px solid var(--border-color);*/
    }

    .funcIcon {
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      /*background: var(--primary);*/
      color: white;
      /*border-radius: var(--radius-sm);*/
      font-size: 1.25rem;
      cursor: pointer;
      transition: all 0.2s;
      /*box-shadow: var(--shadow-md);*/
    }

    .funcIcon:hover {
      background: var(--primary-hover);
      transform: scale(1.05);
      /*box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);*/
    }

    /* Arrows */
    .ascArrow, .descArrow {
      font-size: 0.875rem;
      /*color: var(--primary);*/
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .ascArow {
      transform: rotate(180deg);
    }

    .descArrow {
      transform: rotate(180deg);
    }

    /* Header must be opaque, otherwise scrolled rows show through the sticky cells */
    :host {
      --mat-table-header-container-color: var(--bg-card);
    }

    tr.mat-mdc-header-row,
    th.mat-mdc-header-cell {
      background-color: var(--bg-card);
    }

    th.mat-mdc-header-cell:hover {
      background-color: color-mix(in srgb, var(--bg-card), var(--text-primary) 8%);
    }

    .funcButtons {
      width: 100%;
      justify-content: start;
      display: flex;
      flex-direction: row;
      gap: 10px;
      padding-left: 10px;
    }

    i {
      margin: 3px;
    }

    /* Select stands out from the table (overlay surface + accent border), selected value is centered */
    .periodSelect {
      flex: 0 0 auto;
      width: 180px;
      align-self: center;
      padding: 0.4rem 0.75rem;
      box-sizing: border-box;
      color: var(--text-primary);
      background: var(--bg-overlay);
      border: 1px solid var(--primary, #8b5cf6);
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
    }

    .periodSelect:hover {
      background: color-mix(in srgb, var(--bg-overlay), var(--primary, #8b5cf6) 15%);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary, #8b5cf6), transparent 70%);
    }



    .periodSelect ::ng-deep .mat-mdc-select-value {
      text-align: center;
      font-weight: 600;
      color: var(--text-primary);
    }

    .periodSelect ::ng-deep .mat-mdc-select-arrow,
    .periodSelect ::ng-deep .mat-mdc-select-arrow svg {
      color: var(--text-primary);
      fill: var(--text-primary);
    }

  `,
  template: `
    <div class="tableFooter">
      <div class="funcButtons">
        @if (createFunc) {
          <button style="background: inherit; border: inherit; padding: 0" (click)="createFunc()"
                  [disabled]="isLoading">
            <i class="fa-solid fa-plus funcIcon"></i>
          </button>
        }
        <mat-select class="periodSelect" value="" panelClass="periodSelectPanel">
          <mat-option value="">
            Ostatni tydzień
          </mat-option>
        </mat-select>
        <button style="background: inherit; border: inherit; padding: 0" (click)="resetAll()" [disabled]="isLoading">
          <i class="fa-solid fa-arrow-rotate-left funcIcon"></i>
        </button>
      </div>
      @if (displayPaginator) {
        <mat-paginator
          [length]="totalElements"
          [pageSize]="pageableSignal()?.size"
          [pageSizeOptions]="PAGE_SIZE_OPTIONS"
          (page)="changePage($event)"
          [disabled]="isLoading"
        >
        </mat-paginator>
      }
    </div>
    @let data = displayData || dtoData;
    <div class="tableDiv">

      @if (isLoading) {
        <div class="spinnerContainer">
          <mat-spinner></mat-spinner>
        </div>
      } @else {
        <div class="tableContent">
          <table class="content" mat-table [dataSource]="data">

            <ng-container matColumnDef="no">
              <th mat-header-cell *matHeaderCellDef> Nr.</th>
              <td mat-cell *matCellDef="let column; let i = index">
                {{ i + 1 }}
              </td>
            </ng-container>

            @for (field of tabColumns; track field) {
              <ng-container [matColumnDef]="field.name">

                <th mat-header-cell *matHeaderCellDef>
                  <div class="headerDiv">
                    <div (click)="clickSort(field.name);$event.stopPropagation()" class="sortingButton"
                         style="display: flex; flex-direction: row; gap: 0.75rem; align-items: center ">

                      @if (isClicked && clickedColumn === (field.name)) {

                        <i class="fa-regular fa-circle-up"
                           [ngClass]="{
                          'ascArrow' : isArrowAsc,
                          'descArrow' : !isArrowAsc,
                      }"
                        > </i>

                      }
                      <p> {{ field.displayName }}</p>
                    </div>
                    <i (click)="openSearchDialog($event, field.displayName, field.name, field)"
                       class="fa-solid fa-filter"></i>
                  </div>
                </th>

                <td mat-cell *matCellDef="let element">
                  @switch (field.type) {
                    @case ('BOOLEAN') {
                      <mat-checkbox
                        (change)="checkboxChangeFunc?.(dtoData.filter(d => d.id === element.id)[0])"
                        [checked]="element[field.name]"
                        (click)="$event.stopPropagation()"
                      >
                      </mat-checkbox>
                    }
                    @case ('STATUS') {
                      <app-status [status]="element[field.name]"></app-status>
                    }
                    @case ('OBJECT') {
                      {{ getObjectDisplayValue(element, field) }}
                    }
                    @case ('DATE') {
                      {{ getDateDisplayValue(element[field.name]) }}
                    }
                    @default {
                      {{ element[field.name] }}
                    }
                  }
                </td>

              </ng-container>
            }
            <tr mat-header-row *matHeaderRowDef="columnFields; sticky: true"></tr>
            <tr mat-row
                *matRowDef="let row; let i = index; columns: columnFields"
                (click)="onRowClickFunc?.(dtoData.filter(d => d.id === row.id)[0])"
                class="row"
            >
            </tr>

          </table>
        </div>
      }

    </div>
  `,
})
export class RegularTableComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() public dtoData: any[] = [];
  @Input() public isLoading: boolean = false;
  @Input() public tabColumns: Field[] = [];
  @Input() public totalElements: number = 0;
  @Input() displayPaginator: boolean = true;
  @Input() searchRequestSignal!: WritableSignal<SearchRequest | undefined>;
  @Input() pageableSignal!: WritableSignal<Pageable | undefined | null>;
  @Input() public displayData?: any[];
  @Input() public paginatorData?: PaginatorData;
  @Input() public createFunc?: () => any;
  @Input() public onRowClickFunc?: (dto: any) => any;
  @Input() public checkboxChangeFunc?: (a: any) => any;
  @Input() resetTableFunction: any = () => this.resetAll();


  @Output() public sortInfo = new EventEmitter<Sort>();
  @Output() public filterInfo = new EventEmitter<SearchCriteria[]>();

  private readonly dialog = inject(MatDialog)

  protected isArrowAsc: boolean = false;
  protected isClicked: boolean = false;
  protected clickCount: number = 0;
  protected clickedColumn: string = '';

  protected get columnFields(): string[] {
    return this.tabColumns.map(field => field.name);
  }

  protected clickSort(columnField: string) {
     this.isArrowAsc = !this.isArrowAsc;
     if (columnField !== this.clickedColumn) {
       this.isArrowAsc = true;
       this.clickCount = 0;
       this.isClicked = true;
     }
     this.clickedColumn = columnField;
     let direction: SortDirection | undefined = this.isArrowAsc ? 'ASC' : 'DESC';
     if (this.clickCount++ > 3) {
       this.clickCount = 0;
       this.isClicked = false;
       direction = undefined;
     } else {
       this.clickCount = this.clickCount + 1;
       this.isClicked = true;
     }
     if (this.pageableSignal() !== null) {
       this.pageableSignal.set({...this.pageableSignal(), sort: [columnField, direction!]})
     }
  }

  protected getObjectDisplayValue(displayData: any, field: Field): string {
    return displayData[field.name];
  }

  protected openSearchDialog(event: MouseEvent, label: string, by: string, field: Field) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    const dialogRef = this.dialog.open(SearchByPopupComponent, {
      position: {
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`
      },
      panelClass: 'searchDialog',
      hasBackdrop: false,
      disableClose: true,
      data: { label: label, by: by, field: field, searchCriteriaSignal: this.searchRequestSignal},
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
    });
  }

  protected resetPaginator() {
    if (this.pageableSignal() !== null) {
      this.pageableSignal.set({sort: [], size: 10, page: 0});
    }
  }

  protected resetSortArrow() {
    this.isArrowAsc = false;
    this.isClicked = false;
    this.clickCount = 0;
    this.clickedColumn = '';
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

  protected resetSearchCriteriaFilter() {
    this.searchRequestSignal.set({searchCriteria: []});
  }

  protected resetAll() {
    this.resetSortArrow();
    this.resetPaginator();
    this.resetSearchCriteriaFilter();
  }

  protected getDateDisplayValue(date: Moment) {
    return DateFormater.DDMMYYYY(date, DateDelimiter.DOT);
  }

  protected changePage($event: PageEvent) {
    this.pageableSignal.set({ ...this.pageableSignal(), page: $event.pageIndex, size: $event.pageSize})
  }

  protected readonly PAGE_SIZE_OPTIONS = PAGE_SIZE_OPTIONS;
}

