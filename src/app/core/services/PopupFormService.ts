import {
  ChangeDetectionStrategy,
  Component, DestroyRef,
  EventEmitter,
  inject,
  Injectable,
  Input,
  OnInit,
  Output,
  ViewChild, ViewContainerRef
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, take, tap} from 'rxjs';
import {ReservationService} from '@features/reservations/services/ReservationService';
import {UserService} from '@features/users/services/UserService';
import {PopupConfirmationService} from './PopupConfirmationService';
import {ReservationHelper} from '@features/reservations/services/ReservationHelper';
import {Guest} from '@core/models/Guest';
import {Reservation} from '@core/models/Reservation';
import {PopupFormContainer} from '@shared/popups/form-shell/popup-form-container.component';
import {CamperPlaceService} from '@features/settings/services/CamperPlaceService';
import moment, {Moment} from 'moment';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatOption, MatSelect, MatSelectTrigger} from '@angular/material/select';
import {AsyncPipe, NgComponentOutlet, NgTemplateOutlet} from '@angular/common';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import {MatMomentDateModule, provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatCardTitle} from '@angular/material/card';
import {ConfirmationData} from '@shared/popups/confirmation/popup-confirmation.component';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {CamperPlaceForTable} from '@core/models/CamperPlaceForTable';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YY',
  },
  display: {
    dateInput: 'DD.MM.YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export type ReservationFormData = {reservation?: Reservation, year?: number, month?: number, day?: number};
export type GuestFormData = {guest?: Guest};

@Component({
  selector: 'app-guest-form-component',
  imports: [
    PopupFormContainer,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatInput,
    MatCardTitle,
    NgTemplateOutlet
  ],
  standalone: true,
  styles: `
    mat-dialog-content {
      gap: 1rem;
      padding: 1.5rem !important;
      max-height: 60vh;
      color: #ffffff !important;
    }
    form {
      color: var(--text-primary);
      display: flex;
      flex-direction: column;
    }
    h2 {
      margin: 0;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-primary) !important;
      padding: 1rem !important;
    }
  `,
  template: `
    <ng-template #formTemplate>
      <form [formGroup]="formGroup">

        <mat-form-field>
          <mat-label>Imie</mat-label>
          <input type="text" matInput formControlName="firstname" (input)="emitGuestForm()">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Nazwisko</mat-label>
          <input type="text" matInput formControlName="lastname" (input)="emitGuestForm()">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Email</mat-label>
          <input type="email" matInput formControlName="email" (input)="emitGuestForm()">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Nr Telefonu</mat-label>
          <input type="tel" matInput formControlName="phoneNumber" (input)="emitGuestForm()">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Rejestracja</mat-label>
          <input type="text" matInput formControlName="carRegistration" (input)="emitGuestForm()">
        </mat-form-field>

      </form>
    </ng-template>

    @if (isDialog) {
      <app-popup-form-container [formTitle]="formTitle" [deleteAction]="deleteAction" [isUpdate]="isUpdate">
        <ng-container *ngTemplateOutlet="formTemplate"></ng-container>
      </app-popup-form-container>
    } @else {
      <h2 mat-card-title> {{formTitle}} </h2>
      <ng-container *ngTemplateOutlet="formTemplate"></ng-container>
    }
  `,
})
export class GuestFormComponent {
  @Input() isDialog = true;
  @Output() guestFormEvent = new EventEmitter<FormGroup>();
  private readonly formFactoryService = inject(FormFactoryService);
  private readonly guestService = inject(UserService);
  private readonly fd: GuestFormData = inject<GuestFormData>(MAT_DIALOG_DATA);

  protected isUpdate = !!this.fd.guest;
  protected formTitle = this.isUpdate ? 'Edytuj Gościa' : 'Nowy Gość';
  protected deleteAction = () => this.guestService.delete(this.fd.guest!);
  protected formGroup = this.formFactoryService.buildGuestForm();

  protected emitGuestForm() {
    this.guestFormEvent.emit(this.formGroup);
  }
}

@Component({
  selector: 'app-reservation-form-component',
  imports: [
    ReactiveFormsModule,
    PopupFormContainer,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSelect,
    MatOption,
    AsyncPipe,
    MatInputModule,
    MatCheckbox,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pl-PL'
    },
    provideMomentDateAdapter(DATE_FORMATS),
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    mat-dialog-content {
      gap: 1rem;
      padding: 1.5rem !important;
      max-height: 60vh;
      color: #ffffff !important;
    }
    form {
      color: var(--text-primary);
      display: flex;
      flex-direction: column;
    }
    mat-checkbox {
      margin: 0.5rem 0;
      color: var(--text-secondary);
    }
    app-form-buttons {
      display: block;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.02);
      border-top: 1px solid var(--border-color);
    }
    .guestForm {
      padding: 0 !important;
    }
  `,
  template: `
    <app-popup-form-container [formTitle]="formTitle" [deleteAction]="deleteAction" [isUpdate]="isUpdate" [proceedAction]="proceedAction">
      <form [formGroup]="formGroup">
        <mat-form-field>
          <mat-label>Data Wjazdu</mat-label>
          <input matInput [matDatepicker]="checkin" formControlName="checkinDate">
          <mat-datepicker-toggle matIconSuffix [for]="checkin"></mat-datepicker-toggle>
          <mat-datepicker #checkin [startAt]="checkinDate"></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Data Wyjazdu</mat-label>
          <input matInput [matDatepicker]="checkout" formControlName="checkoutDate">
          <mat-datepicker-toggle matIconSuffix [for]="checkout"></mat-datepicker-toggle>
          <mat-datepicker #checkout [startAt]="startAt"></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Numer Parceli</mat-label>
          <mat-select formControlName="camperPlace">
            @for (cp of camperPlaces$ | async; track cp.id) {
              <mat-option [value]="cp">{{ cp.index }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div>
          <mat-checkbox [checked]="newGuest" (change)="checkNewGuest()"></mat-checkbox>
          <span> {{checkBoxText}} </span>
        </div>

        @if (newGuest) {
          <ng-container #guestForm class="guestForm"/>
        } @else {
          <mat-form-field>
            <mat-label>Gość</mat-label>
            <input type="text" matInput #input formControlName="guestSearch" [matAutocomplete]="auto">
            <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayGuest" (optionSelected)="onGuestSelected($event.option.value)">
              @for (guest of (guests$ | async); track guest.guest.id) {
                <mat-option [value]="guest">
                  {{guest.name}}
                </mat-option>
              }
            </mat-autocomplete>
          </mat-form-field>
        }
      </form>
    </app-popup-form-container>
  `
})
export class ReservationFormComponent implements OnInit {

  @ViewChild('guestForm', {read: ViewContainerRef}) vcr!: ViewContainerRef;

  private readonly formFactoryService = inject(FormFactoryService);
  private readonly reservationService = inject(ReservationService);
  private readonly camperPlaceService = inject(CamperPlaceService);
  private readonly guestService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly popupConfirmationService = inject(PopupConfirmationService);
  private readonly fd: ReservationFormData = inject<ReservationFormData>(MAT_DIALOG_DATA);

  protected isUpdate = !!this.fd.reservation;
  protected formTitle = this.isUpdate ? 'Edycja Rezerwacji' : 'Nowa Rezerwacja';
  protected deleteAction = this.isUpdate ?
    () => this.reservationService.deleteReservation(this.fd.reservation!).pipe(take(1)).subscribe() : null;
  protected proceedAction = () => this.popupConfirmationService.openConfirmationPopup(this.confirmationData);
  protected formGroup = this.formFactoryService.buildReservationForm();
  protected camperPlaces$ = this.camperPlaceService.getCamperPlacesForTable();
  protected guests$: Observable<{ name: string, guest: Guest }[]> = of([]);
  protected startAt = '';
  protected checkinDate = '';
  protected newGuest = false;
  protected checkBoxText = 'Nowy Gość';

  protected createAction = () => {

    const checkin = this.formGroup.get('checkinDate')!.value;
    const checkout = this.formGroup.get('checkoutDate')!.value;
    const camperPlace = this.formGroup.get('camperPlace')!.value;
    const rawGuest = this.formGroup.get('guest')!.value;

    const guest: Guest | undefined = rawGuest
      ? {
        id: rawGuest.id!,
        firstname: rawGuest.firstname,
        lastname: rawGuest.lastname,
        email: rawGuest.email,
        phoneNumber: rawGuest.phoneNumber,
        carRegistration: rawGuest.carRegistration
      }
      : undefined;

    const payload: Reservation = {
      id: this.fd.reservation?.id,
      checkin: checkin!.format('YYYY-MM-DD') ?? '',
      checkout: checkout!.format('YYYY-MM-DD') ?? '',
      camperPlaceIndex: camperPlace!.index ?? '',
      guest: guest,
      paid: false,
    };

    this.reservationService.create(payload)
      .pipe(take(1))
      .subscribe({
        error: () => console.log(payload)
      });
  };

  private confirmationData: ConfirmationData = {
    title: 'Czy chcesz kontynuować?',
    componentData: this.fd.reservation,
    message: this.isUpdate ? 'Rezerwacja zostanie edytowana' : 'Rezerwacja zostanie utworzona',
    action: this.createAction,
  }

  ngOnInit() {
    this.startAt =
      (this.fd.year !== undefined && this.fd.month !== undefined) ? this.getDateFromParams(this.fd.year, this.fd.month, 1) : '';
    this.formGroup.get('checkinDate')?.setValue(moment({year: this.fd.year!, month: this.fd.month!, day: this.fd.day!}));

    this.guests$ = this.formGroup.get('guestSearch')!.valueChanges.pipe(
      debounceTime(150),
      distinctUntilChanged(),
      filter(v => typeof v === 'string'),
      switchMap(v => this.guestService.findAll(undefined, 0, 100, undefined, { by: 'fullName', value: v?? ''})),
      map(e =>
        e.content.map(g => ({
          name: g.firstname + ' ' + g.lastname,
          guest: g
        }))
      )
    );
  }

  private getDateFromParams(year: number, month: number, day: number): string {
    return moment({ year: year, month: month, day: day }).format('YYYY-MM-DD');
  }

  protected checkNewGuest() {
    this.newGuest = !this.newGuest;
    if (this.newGuest) {
      this.checkBoxText = 'Wybierz Istniejącego';
      setTimeout(() => {this.createGuestForm()})
    } else {
      this.checkBoxText = 'Nowy Gość';
      this.vcr?.clear();
    }
  }

  private createGuestForm() {
    if (!this.vcr) return;
    this.vcr.clear();

    const guestFormRef = this.vcr.createComponent(GuestFormComponent);
    guestFormRef.setInput('isDialog', false);

    guestFormRef.instance.guestFormEvent
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(form => {
        console.log(form);
        this.patchGuestForm(form)
      });
  }

  protected displayGuest(value: any): string {
    return value?.name ?? '';
  }

  protected onGuestSelected(selected: { name: string, guest: Guest }) {
    this.formGroup.get('guest')!.patchValue({
        id: selected.guest.id,
        firstname: selected.guest.firstname,
        lastname: selected.guest.lastname,
        email: selected.guest.email,
        phoneNumber: selected.guest.phoneNumber,
        carRegistration: selected.guest.carRegistration
      });

    this.formGroup.get('guestSearch')!.setValue(selected);
  }

  protected patchGuestForm(form: FormGroup) {
    this.formGroup.get('guest')?.patchValue(form.value);
  }

}

@Injectable({providedIn: "root"})
export class FormFactoryService {

  private readonly formBuilder = inject(FormBuilder);

  buildReservationForm() {
    return this.formBuilder.group({
      checkinDate: new FormControl<Moment | null>(null),
      checkoutDate: new FormControl<Moment | null>(null),
      camperPlace: new FormControl<CamperPlaceForTable | null>(null),
      guestSearch: new FormControl<{name: string, guest: Guest} | null>(null),
      guest: new FormControl<Guest | null>(null),
    });
  }

  buildGuestForm() {
    return this.formBuilder.group({
      id: [''],
      firstname: [''],
      lastname: [''],
      email: [''],
      phoneNumber: [''],
      carRegistration: ['']
    })
  }
}

@Injectable({providedIn: "root"})
export class PopupFormService {

    private readonly popupForm: MatDialog = inject(MatDialog);
    private readonly formFactoryService = inject(FormFactoryService);
    guests$: Observable<Guest[]>;
    camperPlaces$: Observable<string[]>;
    constructor(
      private popupConfirmationService: PopupConfirmationService,
      private reservationService: ReservationService,
      private userService: UserService,
      private reservationHelper: ReservationHelper,
      private camperPlaceService: CamperPlaceService
    ) {
      this.guests$ = this.userService.findAll().pipe(map(p=> p.content))

      this.camperPlaces$ = this.camperPlaceService.getCamperPlaces().pipe(map(camperPlaces => camperPlaces.map(cp => cp.index)));
    }

    openReservationFormPopup(reservationFd?: ReservationFormData) {
      const dialogRef = this.popupForm.open(ReservationFormComponent, {
        data: reservationFd,
        panelClass: 'popupForm'
      })
    }

  }
