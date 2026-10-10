import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';

@Component({
  imports: [
    MatGridList,
    MatGridTile
  ],
  selector: 'app-dashboard',
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    mat-grid-list {
      height: 100%;
    }`,
  template: `
    <mat-grid-list [cols]="isMobile() ? 1 : 4" [rowHeight]="isMobile() ? '5:1' : 'fit'" gutterSize="20px">
      @for (tile of tiles; track tile) {
        <mat-grid-tile
          [colspan]="isMobile() ? 1 : tile.cols"
          [rowspan]="isMobile() ? tile.mobileRows : tile.rows"
          [style.background]="tile.color">{{tile.text}}</mat-grid-tile>
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
  tiles: Tile[] = [
    {text: 'Two', cols: 2, rows: 2, mobileRows: 8, color: 'lightgreen'},    // top right, 2x2
    {text: 'Five', cols: 1, rows: 1, mobileRows: 4, color: 'lightpink'},
    {text: 'Six', cols: 1, rows: 1, mobileRows: 4, color: '#DDBDF1'},
    {text: 'Three', cols: 1, rows: 1, mobileRows: 4, color: 'lightpink'},
    {text: 'Four', cols: 1, rows: 1, mobileRows: 4, color: '#DDBDF1'},
    {text: 'One', cols: 2, rows: 1, mobileRows: 4, color: 'lightblue'},     // bottom left, 1x2
    {text: 'Seven', cols: 2, rows: 1, mobileRows: 4, color: 'lightblue'},   // under the 2x2, 1x2
  ];
}
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  mobileRows: number;
  text: string;
}
