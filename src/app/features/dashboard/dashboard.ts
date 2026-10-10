import {Component, inject, Type} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {Widget} from '@features/dashboard/widgets/widget';
import {ReservationFormComponent} from '@shared/form/reservation-form.component';
import {MatCard} from '@angular/material/card';
import {ReservationTable} from '@features/reservations/table/reservation-table.component';
import {CamperPlaceTable} from '@features/settings/settings-page/tables/camper-place-table';
import {RevenueStat} from '@features/statistics/statistics-page/revenue-stat';
import {TodaysRevenueWidget} from '@features/dashboard/widgets/todays-revenue-widget';
import {
  AvailableCamperPlacesWidget
} from '@features/dashboard/widgets/available-camper-places-widget/available-camper-places-widget';
import {RevenueWidget} from '@features/dashboard/widgets/revenue-widget/revenue-widget';
import {
  UnpaidReservationsWidget
} from '@features/dashboard/widgets/unpaid-reservations-widget/unpaid-reservations-widget';
import {RecentActionsWidget} from '@features/dashboard/widgets/recent-actions-widget/recent-actions-widget';

@Component({
  imports: [
    MatGridList,
    MatGridTile,
    Widget,
  ],
  selector: 'app-dashboard',
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    mat-grid-list {
      height: 100%;
    }

    mat-grid-tile {
      background-color: inherit;
      width: 100%;
    }
  `,
  template: `
    <mat-grid-list [cols]="isMobile() ? 1 : 4" [rowHeight]="isMobile() ? '5:1' : 'fit'" gutterSize="20px">
      @for (widget of widgets; track widget) {
        <mat-grid-tile
          [colspan]="isMobile() ? 1 : widget.cols"
          [rowspan]="isMobile() ? widget.mobileRows : widget.rows">
          <app-widget [component]="widget.widgetComponent"/>
        </mat-grid-tile>
      }
    </mat-grid-list>
  `,
})
export class Dashboard {
  // On phones every tile is stacked in a single column
  protected readonly isMobile = toSignal(
    inject(BreakpointObserver).observe(Breakpoints.XSmall).pipe(map(state => state.matches)),
    {initialValue: false}
  );

  // Grid: 3 rows x 4 columns = 12 cells, 7 tiles
  widgets: WidgetObject[] = [
    {cols: 2, rows: 3, mobileRows: 8, widgetComponent: ReservationFormComponent, inputs: [{isDialog: false}]}, //form
    {cols: 1, rows: 1, mobileRows: 4, widgetComponent: TodaysRevenueWidget}, //todays revenue
    {cols: 1, rows: 2, mobileRows: 4, widgetComponent: AvailableCamperPlacesWidget}, //available
    {cols: 1, rows: 2, mobileRows: 4, widgetComponent: RevenueWidget}, //all rev


    {cols: 1, rows: 2, mobileRows: 4, widgetComponent: UnpaidReservationsWidget}, //unpaid Res
    {cols: 1, rows: 2, mobileRows: 4, widgetComponent: RecentActionsWidget}, //logs
    {cols: 2, rows: 2, mobileRows: 4, widgetComponent: ReservationTable}, //recent res

  ];
}

export interface WidgetObject {
  cols: number;
  rows: number;
  mobileRows: number;
  widgetComponent: Type<unknown>;
  inputs?: any[];
}
