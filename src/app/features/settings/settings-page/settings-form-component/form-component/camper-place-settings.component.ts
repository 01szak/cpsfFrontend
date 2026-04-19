import { Component, Input, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CamperPlaceForTable } from '@core/models/CamperPlaceForTable';
import { CamperPlaceType } from '@core/models/CamperPlaceType';
import { CamperPlaceService } from '@features/settings/services/CamperPlaceService';
import { FormFieldDeclaration, RowChange, SettingsGenericComponent } from '../settings-generic-component';
import { PopupConfirmationService } from '@core/services/PopupConfirmationService';
import { take } from 'rxjs';
import {ConfirmationData} from '@shared/popups/confirmation/popup-confirmation.component';
import { PopupFormService } from '@core/services/PopupFormService';

@Component({
  selector: 'app-camper-place-form',
  standalone: true,
  imports: [SettingsGenericComponent],
  template: `
    <app-settings-form-component
      #settingsForm
      [displayedColumns]="displayedColumns"
      [formDeclaration]="formFieldsDeclaration"
      [data]="camperPlaces"
      [formName]="'Parcele'"
      [addNewFunc]="addNewFunc"
      [deleteFunc]="deleteFunc"
      (saveRequest)="onSave($any($event))"
    />
  `,
  styles: [``]
})
export class CamperPlaceSettingsComponent {

  @ViewChild('settingsForm') settingsForm!: SettingsGenericComponent<CamperPlaceForTable>;

  private readonly popupConfirmationService = inject(PopupConfirmationService);
  private readonly cdr = inject(ChangeDetectorRef);

  private _camperPlaces: CamperPlaceForTable[] | null = [];
  @Input() set camperPlaces(value: CamperPlaceForTable[] | null) {
    this._camperPlaces = value;
    this.updateFormDeclaration();
    this.cdr.markForCheck();
  }
  get camperPlaces() {
    return this._camperPlaces;
  }

  private _camperPlaceTypes: CamperPlaceType[] | null = [];
  @Input() set camperPlaceTypes(value: CamperPlaceType[] | null) {
    this._camperPlaceTypes = value;
    this.updateFormDeclaration();
  }

  protected camperPlaceService = inject(CamperPlaceService);
  protected popupService = inject(PopupConfirmationService);
  protected popupFormService = inject(PopupFormService);

  protected displayedColumns = ['index', 'type', 'price'];
  protected formFieldsDeclaration: FormFieldDeclaration[] = [];

  protected addNewFunc = () => {
    this.popupFormService.openCamperPlaceFormPopup();
  };

  protected deleteFunc = (camperPlace: CamperPlaceForTable) => {
    this.popupConfirmationService.openConfirmationPopup({
      action: () => {
        this.camperPlaceService.delete(camperPlace).pipe(take(1)).subscribe()
      },
      message: "Usunięcie parceli, spowoduje trwałe usunięcie wszystkich rezerwacji, które były na niej zrobione. Czy chcesz kontynuowć? (nie zalecane!)",
    } as ConfirmationData)
  };

  onSave(changes: RowChange<CamperPlaceForTable>[]) {
    const typeChanged = changes.some(c => c.original.type!.id !== c.updated.type!.id);
    const updatedRows = changes.map(c => c.updated);
    if (typeChanged) {
      this.popupService.openConfirmationPopup(this.typeChangeData(updatedRows));
    } else {
      this.popupService.openConfirmationPopup(this.defaultChangeData(updatedRows));
    }
  }

  private typeChangeData(updatedRows: CamperPlaceForTable[]): ConfirmationData {
    return {
      title: 'Zmiana Typu Parceli',
      message: 'Zmiana typu parceli spowoduje automatyczne nadpisanie jej ceny na cenę domyślną nowego typu. Czy na pewno chcesz kontynuować?',
      action: () => {
        this.camperPlaceService.update(updatedRows).pipe(take(1)).subscribe({
          error: () => this.settingsForm.reset()
        });
      }
    };
  }

  private defaultChangeData(updatedRows: CamperPlaceForTable[]): ConfirmationData {
    return {
      title: 'Zapisywanie Zmian',
      message: `Czy na pewno chcesz zapisać zmiany?`,
      action: () => {
        this.camperPlaceService.update(updatedRows).pipe(take(1)).subscribe({
          error: () => this.settingsForm.reset()
        });
      }
    };
  }
  private updateFormDeclaration() {
    this.formFieldsDeclaration = [
      { columnDef: 'index', headerName: 'Indeks', rowType: 'input', valueType: 'text' },
      {
        columnDef: 'type',
        headerName: 'Rodzaj',
        rowType: 'select',
        selectData: this._camperPlaceTypes,
        displayKey: 'typeName',
        onValueChange: (newType: CamperPlaceType, group) => {
          if (newType && 'price' in newType) {
            group.get('price')?.setValue(newType.price, { emitEvent: false });
            group.markAsDirty();
          }
        }
      },
      { columnDef: 'price', headerName: 'Cena', rowType: 'input', valueType: 'number' },
    ];
  }
}
