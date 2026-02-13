import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {PopupFormService} from '../../../service/PopupFormService';
import {Filter, Sort} from '../regular-table/regular-table.component';
import {Observable, Subscription} from 'rxjs';
import {Page} from '../../Interface/Page';
import {BackendEntity} from '../../Interface/BackendEntity';
import {BackendService} from '../../../service/BackendService';
import {Directive} from "@angular/core";

@Directive()
export class BaseTablePage<T extends BackendEntity, S extends BackendService<T>> {


  protected pagedData!: Observable<Page<T>>;
  protected pageSize: number = 0;
  protected pageSizeOptions: number[] = [10, 20, 50, 100, 150];
  protected filterInfo!: Filter;
  protected sortInfo!: Sort;
  protected event?: PageEvent;
  protected page: number = 0;
  protected size: number = 0
  protected paginatorLength: number = 0;
  protected sub!: Subscription;
  protected additionalFunc?: (t: T) => any;
  protected columns!:  {type: string, field: string }[];
  protected displayedColumns!: string[];
  protected formService!: PopupFormService;
  protected paginator!: MatPaginator;

  constructor(protected backendService: S) {
    this.pagedData = this.backendService.pageData$;
  }

  protected fetchData(event?: PageEvent, page?: number, size?: number) {
    if (event) this.event = event;
    if (page !== undefined) this.page = page;
    if (size !== undefined) this.size = size;
    this.sub?.unsubscribe();
    this.sub = this.backendService.findAll(
      this.event,
      this.page,
      this.size,
      this.sortInfo,
      this.filterInfo
    ).subscribe(p => {this.paginatorLength = p.totalElements});
  }

  protected getSortInfo(sort: Sort) {
    this.sortInfo = sort;
    this.fetchData(this.event, this.page, this.size);
  }

  protected getFilterInfo(filter: Filter) {
    this.filterInfo = filter;
    this.page = 0;

    if (this.paginator) {
      this.paginator.firstPage();
    }

    this.fetchData(this.event, this.page, this.size);
  }

  protected getPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
  }

  protected openCreatePopup() {
    // to implement by inheritors
  }

  protected  openUpdatePopup(t: T) {
  // to implement by inheritors
  }

}

