import {Component, computed, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatDateRangeInput, MatDateRangePicker, MatDatepickerToggle, MatEndDate, MatStartDate} from '@angular/material/datepicker';
import {MatInput} from '@angular/material/input';
import {Moment} from 'moment';
import {Field, RegularTableComponent} from '@shared/ui/data-table/regular-table.component';
import {CamperPlaceService} from '@core/services/openApiWrappers/CamperPlaceService';
import {CamperPlaceDto} from '../../../../api';
import {DateDelimiter, DateFormater} from '@shared/helper/DateFormater';

@Component({
  imports: [
    RegularTableComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSuffix,
    MatInput,
    MatDateRangeInput,
    MatStartDate,
    MatEndDate,
    MatDatepickerToggle,
    MatDateRangePicker,
  ],
  selector: 'app-available-camper-places-widget',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: 0;
    }

    .rangeField {
      flex: 0 0 auto;
      width: 220px;
    }

    /*
      styles.scss sets background-color: inherit !important on every filled text field, which makes the
      fill transparent (only the underline is left, so the field looks like a plain box). Restore the fill here.
    */
    .rangeField ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
      background-color: var(--primary) !important;
      border-radius: 8px 8px 0 0;
    }

    app-regular-table {
      flex: 1;
      min-height: 0;
    }
  `,
  template: `
    <ng-template #rangeSelector>
    <mat-form-field appearance="fill" class="rangeField" >
      <mat-label>Zakres dat</mat-label>
      <mat-date-range-input [formGroup]="range" [rangePicker]="picker">
        <input  matStartDate formControlName="start" placeholder="Wjazd">
        <input matEndDate formControlName="end" placeholder="Wyjazd">
      </mat-date-range-input>
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
    </mat-form-field>
    </ng-template>

    <app-regular-table
      [tittle]="'Wolne parcele'"
      [dtoData]="camperPlaceService.availableCamperPlacesResource.value()"
      [displayData]="displayData()"
      [isLoading]="camperPlaceService.availableCamperPlacesResource.isLoading()"
      [tabColumns]="fields"
      [displayViewFilter]="false"
      [displayPaginator]="false"
      [additionalSelector]="rangeSelector"
      [resetTableFunction]="resetRange"
    >
    </app-regular-table>
    <!--      [totalElements]="camperPlaceService.availableCamperPlacesResource.value().totalElements"-->
  `,
})
export class AvailableCamperPlacesWidget implements OnInit {
  protected readonly camperPlaceService = inject(CamperPlaceService);

  protected readonly range = new FormGroup({
    start: new FormControl<Moment | null>(null),
    end: new FormControl<Moment | null>(null),
  });

  protected readonly fields: Field[] = [
    {name: 'index', displayName: 'Indeks', type: 'TEXT'},
    {name: 'type', displayName: 'Typ', type: 'TEXT'},
    {name: 'price', displayName: 'Cena [PLN]', type: 'NUMBER'},
  ];

  protected readonly displayData = computed(() =>
    (this.camperPlaceService.availableCamperPlacesResource.value() as CamperPlaceDto[]).map(p => ({
      id: p.id,
      index: p.index,
      type: p.camperPlaceType?.typeName ?? '',
      price: p.price,
    }))
  );

  //clears the date range picker and the signal, the resource goes back to idle (empty table)
  protected readonly resetRange = () => {
    this.range.reset();
    this.camperPlaceService.availabilityRange.set(undefined);
  };

  constructor() {
    //the signal is changed only when both borders are picked, a half selected range is ignored
    this.range.valueChanges.subscribe(({start, end}) => {
      if (start && end) {
        this.camperPlaceService.availabilityRange.set({
          from: DateFormater.YYYYMMDD(start, DateDelimiter.DASH),
          to: DateFormater.YYYYMMDD(end, DateDelimiter.DASH),
        });
      }
    });
  }

  ngOnInit(): void {
    this.resetRange();
  }
}
