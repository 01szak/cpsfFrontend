import {Component, computed, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import moment, {Moment} from 'moment';
import {Field, RegularTableComponent} from '@shared/ui/data-table/regular-table.component';
import {StatisticsService} from '@core/services/openApiWrappers/StatisticsService';

//month / year picker (the moment adapter uses the moment tokens, so YYYY instead of yyyy)
const MONTH_YEAR_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  imports: [
    RegularTableComponent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSuffix,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
  ],
  //overrides the app wide date formats for this widget only
  providers: [provideMomentDateAdapter(MONTH_YEAR_FORMATS)],
  selector: 'app-revenue-widget',
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .monthField {
      flex: 0 0 auto;
      width: 150px;
    }

    /* styles.scss makes every filled text field transparent (background-color: inherit !important) */
    .monthField ::ng-deep .mdc-text-field--filled:not(.mdc-text-field--disabled) {
      background-color: var(--primary) !important;
      border-radius: 8px 8px 0 0;
    }
  `,
  template: `
    <ng-template #monthSelector>
      <mat-form-field appearance="fill" class="monthField" subscriptSizing="dynamic">
        <mat-label>Miesiąc</mat-label>
        <input matInput [matDatepicker]="picker" [formControl]="period" readonly>
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker startView="multi-year" (monthSelected)="setMonthAndYear($event, picker)"></mat-datepicker>
      </mat-form-field>
    </ng-template>

    <app-regular-table
      [tittle]="'Przychody'"
      [dtoData]="rows()"
      [displayData]="rows()"
      [isLoading]="statisticsService.revenueResource.isLoading()"
      [tabColumns]="fields()"
      [displayViewFilter]="false"
      [displayPaginator]="false"
      [additionalSelector]="monthSelector"
      [resetTableFunction]="resetPeriod"
    >
    </app-regular-table>
  `,
})
export class RevenueWidget {
  protected readonly statisticsService = inject(StatisticsService);

  protected readonly period = new FormControl<Moment>(this.currentPeriod());

  //sorted by the number first, then by the letter (1, 2, 2a, 10)
  protected readonly rows = computed(() =>
    this.statisticsService.paidRevenue()
      .map(r => ({id: r.cpIndex, camperPlaceNumber: r.cpIndex, reservationCount: r.count ?? 0, revenue: r.revenue ?? 0}))
      .sort((a, b) => {
        const A = this.parseCpIndex(a.camperPlaceNumber ?? '');
        const B = this.parseCpIndex(b.camperPlaceNumber ?? '');
        return A.num - B.num || A.letter.localeCompare(B.letter);
      })
  );

  protected readonly fields = computed<Field[]>(() => {
    const rows = this.rows();
    return [
      {name: 'camperPlaceNumber', displayName: 'Nr. parceli', type: 'TEXT', footer: 'Suma:'},
      {name: 'reservationCount', displayName: 'Ilość rezerwacji', type: 'NUMBER', footer: rows.reduce((sum, r) => sum + r.reservationCount, 0)},
      {name: 'revenue', displayName: 'Obrót [PLN]', type: 'NUMBER', footer: rows.reduce((sum, r) => sum + r.revenue, 0)},
    ];
  });

  //the picker works on the whole month, the service counts the months from 0 like Moment
  protected setMonthAndYear(selected: Moment, picker: MatDatepicker<Moment>) {
    this.period.setValue(selected.clone().startOf('month'));
    this.statisticsService.month.set(selected.month());
    this.statisticsService.year.set(selected.year());
    picker.close();
  }

  //back to the current month, which reloads the data
  protected readonly resetPeriod = () => {
    const now = moment().startOf('month');
    this.period.setValue(now);
    this.statisticsService.month.set(now.month());
    this.statisticsService.year.set(now.year());
  };

  //starts from the period kept by the service (shared with the statistics page)
  private currentPeriod(): Moment {
    return moment({year: this.statisticsService.year(), month: this.statisticsService.month(), day: 1});
  }

  private parseCpIndex(value: string) {
    const match = value.match(/^(\d+)([a-zA-Z]?)$/);
    return {
      num: match ? Number(match[1]) : Number.MAX_SAFE_INTEGER,
      letter: match ? match[2] || '' : ''
    };
  }
}
