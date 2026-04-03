import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, take} from 'rxjs';
import {ReservationService} from '@features/reservations/services/ReservationService';
import {UserService} from '@features/users/services/UserService';
import {PopupConfirmationService} from '@core/services/PopupConfirmationService';
import {Guest} from '@core/models/Guest';
import {Reservation} from '@core/models/Reservation';
import {CamperPlaceService} from '@features/settings/services/CamperPlaceService';
import {FormFactoryService} from '@core/services/form-factory.service';
import {PopupFormContainer} from './popup-form-container.component';
import {GuestFormComponent} from './guest-form.component';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {AsyncPipe} from '@angular/common';
import {CamperPlaceForTable} from '@core/models/CamperPlaceForTable';
import {Page} from '@core/models/Page';
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

export type ReservationFormData = {
  reservation?: Reservation;
  year?: number;
  month?: number;
  day?: number;
  camperPlace?: CamperPlaceForTable;
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
    MatMomentDateModule
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-popup-form-container
      [formTitle]="formTitle"
      [deleteAction]="deleteAction"
      [isUpdate]="isUpdate"
      [proceedAction]="onSave">

      <form [formGroup]="formGroup" style="display: flex; flex-direction: column; gap: 1rem;">
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
          @if (!selectedCp) {
            <mat-select formControlName="camperPlace">
              @for (cp of camperPlaces$ | async; track cp.id) {
                <mat-option [value]="cp">{{ cp.index }}</mat-option>
              }
            </mat-select>
          } @else {
            <input type="text" matInput [disabled]="true" [value]="camperPlaceIndex">
          }
        </mat-form-field>

        <div style="margin: 1rem 0;">
          <mat-checkbox [(ngModel)]="isNewGuest" [ngModelOptions]="{standalone: true}">
            {{ isUpdate ? 'Zmień dane gościa' : 'Nowy gość' }}
          </mat-checkbox>
        </div>

        @if (isNewGuest) {
          <app-guest-form [isDialog]="false" [formGroup]="guestSubForm"></app-guest-form>
        } @else if (isUpdate && currentGuest) {
          <mat-form-field>
            <mat-label>Gość</mat-label>
            <input type="text" matInput [disabled]="true" [value]="guestFullName">
          </mat-form-field>
        } @else {
          <mat-form-field>
            <mat-label>Wyszukaj gościa</mat-label>
            <input type="text" matInput formControlName="guestSearch" [matAutocomplete]="auto">
            <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayGuestName"
                              (optionSelected)="onGuestSelected($event.option.value)">
              @for (g of (guests$ | async); track g.guest.id) {
                <mat-option [value]="g">{{ g.name }}</mat-option>
              }
            </mat-autocomplete>
          </mat-form-field>
        }
      </form>
    </app-popup-form-container>
  `,
})
export class ReservationFormComponent implements OnInit {
  private readonly factory = inject(FormFactoryService);
  private readonly reservationService = inject(ReservationService);
  private readonly guestService = inject(UserService);
  private readonly camperPlaceService = inject(CamperPlaceService);
  private readonly confirmation = inject(PopupConfirmationService);
  private readonly dialogRef = inject(MatDialogRef<ReservationFormComponent>);
  private readonly fd: ReservationFormData = inject(MAT_DIALOG_DATA);
  private readonly cdr = inject(ChangeDetectorRef);

  protected selectedCp? = this.fd?.camperPlace;
  protected currentGuest? = this.fd?.reservation?.guest;
  protected isUpdate = !!this.fd?.reservation;
  protected formGroup: FormGroup = this.factory.buildReservationForm();
  protected formTitle = this.isUpdate ? 'Edycja Rezerwacji' : 'Nowa Rezerwacja';
  protected isNewGuest = false;
  protected camperPlaces$ = this.camperPlaceService.getCamperPlacesForTable();
  protected guests$: Observable<{ name: string; guest: Guest }[]> = of([]);
  protected checkinCalendarStart: moment.Moment | null = null;
  protected checkoutCalendarStart: moment.Moment | null = null;

  get guestSubForm(): FormGroup {
    return this.formGroup.get('guest') as FormGroup;
  }

  ngOnInit() {
    this.setupGuestSearch();
    this.initialPatch();
  }

  private setupGuestSearch() {
    this.guests$ = this.formGroup.get('guestSearch')!.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((v): v is string => typeof v === 'string' && v.length > 1),
      switchMap((v: string) => this.guestService.findAll(undefined, 0, 50, undefined, { by: 'fullName', value: v })),
      map((res: Page<Guest>) => (res.content || []).map((g: Guest) => ({ name: `${g.firstname} ${g.lastname}`, guest: g })))
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
        this.formGroup.get('guestSearch')?.setValue(`${g.firstname} ${g.lastname}`);
      }

    } else {
      if (this.fd?.camperPlace) {
        this.formGroup.get('camperPlace')?.setValue(this.fd.camperPlace);
      }
      if (this.fd?.year && this.fd?.month !== undefined && this.fd?.day) {
        const date = DateFormater.MOMENT({year: this.fd.year, month: this.fd.month, day: this.fd.day});
        this.formGroup.get('checkinDate')?.setValue(date);
        this.checkinCalendarStart = date;
        this.checkoutCalendarStart = DateFormater.MOMENT({year: this.fd.year, month: this.fd.month, day: 1});
      }
    }
    this.cdr.markForCheck();
  }

  protected displayGuestName(val: any) { return val?.name ?? ''; }

  protected onGuestSelected(val: any) {
    this.factory.patchGuest(this.formGroup, val.guest);
  }

  protected deleteAction = this.isUpdate ? () => {
    this.confirmation.openConfirmationPopup({
      title: 'Usuwanie',
      message: 'Czy na pewno usunąć tę rezerwację?',
      action: () => this.reservationService.deleteReservation(this.fd.reservation!).pipe(take(1)).subscribe(() => this.dialogRef.close())
    });
  } : null;

  protected onSave = () => {
    const checkin = DateFormater.YYYYMMDD(this.formGroup.get('checkinDate')!.value, DateDelimiter.DASH);
    const checkout = DateFormater.YYYYMMDD(this.formGroup.get('checkoutDate')!.value, DateDelimiter.DASH);
    const camperPlace = this.formGroup.get('camperPlace')!.value;
    const guest = this.formGroup.get('guest')!.value;

    const payload: Reservation = {
      id: this.fd.reservation?.id,
      checkin: checkin,
      checkout: checkout,
      camperPlace: camperPlace!.index,
      guest: guest,
      paid: this.fd.reservation!.paid
    };

    this.confirmation.openConfirmationPopup({
      title: 'Zapisywanie',
      message: 'Czy chcesz zapisać zmiany?',
      action: () => (this.isUpdate ? this.reservationService.update(payload) : this.reservationService.create(payload))
        .pipe(take(1)).subscribe(() => this.dialogRef.close())
    });
  }

  get camperPlaceIndex() {
    return this.formGroup.get('camperPlace')?.value?.index;
  }

  get guestFullName() {
    return this.formGroup.get('guestSearch')?.value;
  }
}
