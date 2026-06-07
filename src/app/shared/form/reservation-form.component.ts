import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {debounceTime, distinctUntilChanged, filter, from, map, Observable, of, switchMap} from 'rxjs';
import { trigger, style, transition, animate } from '@angular/animations';
import {ReservationService} from '@features/reservations/services/ReservationService';
import {PopupConfirmationService} from '@core/services/PopupConfirmationService';
import {CamperPlaceService} from '@features/settings/services/CamperPlaceService';
import {FormFactoryService} from '@shared/form/FormFactoryService';
import {PopupFormContainer} from './popup-form-container.component';
import {GuestFormComponent} from './guest-form.component';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {AsyncPipe} from '@angular/common';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import moment from 'moment';
import {
  MatMomentDateModule,
} from '@angular/material-moment-adapter';
import {DateDelimiter, DateFormater} from '@shared/helper/DateFormater';
import {MatButton} from '@angular/material/button';
import {Api} from '../../api/api';
import {GuestDto, ReservationDto} from '../../api';
import {CamperPlaceDto} from '../../api/models/camper-place-dto';
import {GuestService} from '@features/guests/services/GuestService';
import {Page} from '@core/models/Page';
import {COUNTRIES, Country} from '@shared/constants/COUNTRIES';

export type ReservationFormData = {
  reservation?: ReservationDto;
  year?: number;
  month?: number;
  day?: number;
  camperPlace?: CamperPlaceDto;
};

@Component({
  selector: 'app-reservation-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PopupFormContainer,
    GuestFormComponent,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatAutocomplete,
    MatAutocompleteTrigger,
    AsyncPipe,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatDatepicker,
    MatMomentDateModule,
    MatDialogTitle,
    MatButton,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: '0', opacity: 0, overflow: 'hidden', display: 'block' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden', display: 'block' }),
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ height: '0', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <app-popup-form-container
      [formTitle]="formTitle"
      [deleteAction]="deleteAction"
      [isUpdate]="isUpdate"
      [proceedAction]="onSave">

      <form [formGroup]="formGroup" [@.disabled]="!animationsEnabled"
            style="display: flex; flex-direction: column; gap: 1rem;">
        <mat-form-field>
          <mat-label>Data Wjazdu</mat-label>
          <input matInput [matDatepicker]="checkin" formControlName="checkinDate">
          <mat-datepicker-toggle matIconSuffix [for]="checkin">
            <i class="fa-solid fa-calendar" style="font-size: large" matDatepickerToggleIcon></i>
          </mat-datepicker-toggle>
          <mat-datepicker #checkin [startAt]="checkinCalendarStart"></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Data Wyjazdu</mat-label>
          <input matInput [matDatepicker]="checkout" formControlName="checkoutDate">
          <mat-datepicker-toggle matIconSuffix [for]="checkout">
            <i class="fa-solid fa-calendar" style="font-size: large" matDatepickerToggleIcon></i>
          </mat-datepicker-toggle>
          <mat-datepicker #checkout [startAt]="checkoutCalendarStart"></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Numer Parceli</mat-label>
          @if (selectedCpFromCalendar && !isUpdate) {
            <input type="text" matInput [disabled]="true" [value]="camperPlaceIndex">
          } @else {
            <mat-select formControlName="camperPlace" [compareWith]="compareFn">
              @for (cp of (camperPlaces$ | async); track cp.id) {
                <mat-option [value]="cp">{{ cp.index }}</mat-option>
              }
            </mat-select>
          }
        </mat-form-field>

        <div style="margin: 0.5rem 0;">
          <mat-checkbox formControlName="isPaid">Opłacone</mat-checkbox>
        </div>

        <div style="margin: 0.5rem 0;">
          <button mat-stroked-button (click)="setNewGuest()">
            {{ isUpdate ? (isNewGuest ? 'Cofnij' : 'Zmień dane gościa' ) : (isNewGuest ? 'Wybierz Istniejącego' : 'Nowy Gość' ) }}
          </button>
        </div>

        @if (isNewGuest) {
          <div [@expandCollapse] style="overflow: hidden;">
            <h2 mat-dialog-title
                style="margin: 0; text-align: center; border-bottom: 1px solid var(--border-color); color: var(--text-primary) !important; padding: 1rem !important;">{{ GuestTittle }}</h2>
            <app-guest-form [isDialog]="false" [formGroup]="guestSubForm"></app-guest-form>
          </div>
        } @else if (isUpdate && currentGuest) {
          <div [@expandCollapse] style="overflow: hidden;">
            <mat-form-field style="width: 100%">
              <mat-label>Gość</mat-label>
              <input type="text" matInput [disabled]="true" [value]="guestFullName">
            </mat-form-field>
          </div>
        } @else {
          <div [@expandCollapse] style="overflow: hidden;">
            <mat-form-field style="width: 100%">
              <mat-label>Wyszukaj gościa</mat-label>
              <input type="text" matInput formControlName="guestSearch" [matAutocomplete]="auto">
              <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayGuestName"
                                (optionSelected)="onGuestSelected($event.option.value)">
                @for (g of (guests$ | async); track g.guest.id) {
                  <mat-option [value]="g">{{ g.name }}</mat-option>
                }
              </mat-autocomplete>
            </mat-form-field>
          </div>
        }
      </form>
    </app-popup-form-container>
  `,
})
export class ReservationFormComponent implements OnInit {
  private readonly api = inject(Api);
  private readonly factory = inject(FormFactoryService);
  private readonly reservationService = inject(ReservationService);
  private readonly camperPlaceService = inject(CamperPlaceService);
  private readonly guestService = inject(GuestService);
  private readonly confirmation = inject(PopupConfirmationService);
  private readonly dialogRef = inject(MatDialogRef<ReservationFormComponent>);
  private readonly fd: ReservationFormData = inject(MAT_DIALOG_DATA);
  private readonly cdr = inject(ChangeDetectorRef);

  protected selectedCpFromCalendar? = this.fd?.camperPlace;
  protected currentGuest? = this.fd?.reservation?.guest;
  protected isUpdate = !!this.fd?.reservation;
  protected formGroup: FormGroup = this.factory.buildReservationForm();
  protected formTitle = this.isUpdate ? 'Edycja Rezerwacji' : 'Nowa Rezerwacja';
  protected GuestTittle = this.isUpdate ? 'Edycja Gościa' : 'Nowy Gość';
  protected isNewGuest = false;
  protected camperPlaces$: Observable<CamperPlaceDto[]> = this.camperPlaceService.camperPlacesForTable$;
  protected guests$: Observable<{ name: string; guest: GuestDto }[]> = of([]);
  protected checkinCalendarStart: moment.Moment | null = null;
  protected checkoutCalendarStart: moment.Moment | null = null;
  protected animationsEnabled = false;

  get guestSubForm(): FormGroup {
    return this.formGroup.get('guest') as FormGroup;
  }

  ngOnInit() {
    this.setupGuestSearch();
    this.initialPatch();

    setTimeout(() => {
      this.animationsEnabled = true;
      this.cdr.markForCheck();
    }, 500);
  }

  private setupGuestSearch() {
    this.guests$ = this.formGroup.get('guestSearch')!.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((v): v is string => typeof v === 'string' && v.length > 1),
      switchMap((v: string) => this.guestService.findBy(
        undefined, 0, 50, undefined,
        { key: 'lastname', value: v, operation: 'LIKE' }
      )),
      map((res: Page<GuestDto>) => (res.content || []).map((g: GuestDto) => ({ name: `${g.firstname || ''} ${g.lastname || ''}`.trim(), guest: g })))
    );
  }

  private initialPatch() {
    if (this.fd?.reservation) {
      this.factory.patchReservation(this.formGroup, this.fd?.reservation!);
      const checkin = DateFormater.MOMENT(this.fd.reservation.checkin);
      const checkout = DateFormater.MOMENT(this.fd.reservation.checkout);

      this.checkinCalendarStart = checkin;
      this.checkoutCalendarStart = checkout;

      if (this.fd.reservation.guest) {
        const g = this.fd.reservation.guest;
        this.formGroup.get('guestSearch')?.setValue(`${g.firstname || ''} ${g.lastname || ''}`.trim());
      }

      if (this.fd?.reservation.camperPlace) {
        this.formGroup.get('camperPlace')?.setValue(this.fd.reservation.camperPlace);
      }
    } else {
      if (this.fd?.year && this.fd?.month !== undefined && this.fd?.day) {
        const date = DateFormater.MOMENT({year: this.fd.year, month: this.fd.month, day: this.fd.day});
        this.formGroup.get('checkinDate')?.setValue(date);
        this.checkinCalendarStart = date;
        this.checkoutCalendarStart = DateFormater.MOMENT({year: this.fd.year, month: this.fd.month, day: 1});
      }

      if (this.fd?.camperPlace) {
        this.formGroup.get('camperPlace')?.setValue(this.fd.camperPlace);
      }
    }

    this.cdr.markForCheck();
  }

  protected displayGuestName(val: any) { return val?.name ?? ''; }

  protected compareFn(o1: any, o2: any): boolean {
    return (o1 && o2) ? (o1.id == o2.id) : (o1 === o2);
  }

  protected onGuestSelected(val: any) {
    this.factory.patchGuest(this.formGroup, val.guest);
  }

  protected deleteAction = this.isUpdate ? () => {
    this.confirmation.openConfirmationPopup({
      title: 'Usuwanie',
      message: 'Czy na pewno usunąć tę rezerwację?',
      action: () => this.reservationService.deleteReservation(this.fd.reservation!).subscribe(() => this.dialogRef.close())
    });
  } : null;

  protected onSave = () => {
    const checkin = DateFormater.YYYYMMDD(this.formGroup.get('checkinDate')!.value, DateDelimiter.DASH);
    const checkout = DateFormater.YYYYMMDD(this.formGroup.get('checkoutDate')!.value, DateDelimiter.DASH);
    const camperPlace = this.formGroup.get('camperPlace')!.value;
    const guest = this.formGroup.get('guest')!.value;
    const isPaid = this.formGroup.get('isPaid')!.value;

    if (guest.country !== null) {
      const rawCountry = guest.country as Country | string | null | undefined;
      guest.country = typeof rawCountry === 'string'
      ? rawCountry
      : (rawCountry?.isoCode || undefined);
      guest.country = guest.country.isoCode as Country;
    }

    const payload: ReservationDto = {
      id: this.fd.reservation?.id,
      checkin: checkin,
      checkout: checkout,
      camperPlace: camperPlace!,
      paid: isPaid,
      guest: guest,
    };

    this.confirmation.openConfirmationPopup({
      title: 'Zapisywanie',
      message: 'Czy chcesz zapisać zmiany?',
      action: () => (this.isUpdate ? this.reservationService.update(payload) : this.reservationService.create(payload))
        .subscribe(() => this.dialogRef.close())
    });
  }

  protected setNewGuest() {
    this.isNewGuest = !this.isNewGuest;
    if (this.isNewGuest && !this.isUpdate) {
      //if we want to creat new guest then we have to reset the guest form to prevent duplication / data overriding
      this.formGroup.get('guest')?.reset();
      this.formGroup.get('guestSearch')?.reset();
    }
  }

  get camperPlaceIndex() {
    return this.formGroup.get('camperPlace')?.value?.index;
  }

  get guestFullName() {
    return this.formGroup.get('guestSearch')?.value;
  }
}
