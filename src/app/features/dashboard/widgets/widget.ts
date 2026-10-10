import {Component, input, Type} from '@angular/core';
import {NgComponentOutlet} from '@angular/common';
import {MatCard} from '@angular/material/card';

@Component({
  imports: [
    MatCard,
    NgComponentOutlet
  ],
  selector: 'app-widget',
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    mat-card {
      width: 100%;
      height: 100%;
    }

    ng-container {
      padding: 10px;
    }

  `,
  template: `
    <mat-card>
      <ng-container *ngComponentOutlet="component()"></ng-container>
    </mat-card>
  `,
})
export class Widget {
  readonly component = input.required<Type<unknown>>();
}
