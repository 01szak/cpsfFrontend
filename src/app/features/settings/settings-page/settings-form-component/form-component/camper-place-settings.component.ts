import { Component, Input, inject, ViewChild } from '@angular/core';
import { CamperPlaceDto } from '../../../../../api/models/camper-place-dto';
import { CamperPlaceTypeDto } from '../../../../../api/models/camper-place-type-dto';
import { CamperPlaceService } from '@features/settings/services/CamperPlaceService';
import { FormFieldDeclaration, RowChange, SettingsGenericComponent } from '../settings-generic-component';
import { PopupConfirmationService } from '@core/services/PopupConfirmationService';
import { take } from 'rxjs';
import {ConfirmationData} from '@shared/popups/confirmation/popup-confirmation.component';

@Component({
  selector: 'app-camper-place-form',
  standalone: true,
  imports: [SettingsGenericComponent],
  template: `
    <app-settings-form-component
      #settingsForm
      [formName]="'Parcele'"
      [addNewFunc]="addNewFunc"
      [displayedColumns]="displayedColumns"
      [formDeclaration]="formFieldsDeclaration"
      [data]="camperPlaces"
      [deleteFunc]="deleteFunc"
      (saveRequest)="onSave($any($event))"
    />
  `,
  styles: [``]
})
export class CamperPlaceSettingsComponent {
  @ViewChild('settingsForm') settingsForm!: SettingsGenericComponent<CamperPlaceDto>;

  private _camperPlaces: CamperPlaceDto[] | null = [];
  @Input() set camperPlaces(value: CamperPlaceDto[] | null) {
    this._camperPlaces = value;
    this.updateFormDeclaration();
  }
  get camperPlaces() {
    return this._camperPlaces;
  }

  private _camperPlaceTypes: CamperPlaceTypeDto[] | null = [];
  @Input() set camperPlaceTypes(value: CamperPlaceTypeDto[] | null) {
    this._camperPlaceTypes = value;
    this.updateFormDeclaration();
  }

  protected camperPlaceService = inject(CamperPlaceService);
  protected popupService = inject(PopupConfirmationService);

  protected displayedColumns = ['index', 'type', 'price', 'actions'];
  protected formFieldsDeclaration: FormFieldDeclaration[] = [];

  protected addNewFunc = () => {
    this.popupFormService.openCamperPlaceFormPopup();
  }

  protected deleteFunc = (camperPlace: CamperPlaceDto) => {
    this.popupService.openConfirmationPopup({
        title: 'Usuwanie',
        message: 'Czy na pewno usunąć tę parcelę?',
        action: () => this.camperPlaceService.delete(camperPlace).pipe(take(1)).subscribe()
    });
  }

  onSave(changes: RowChange<CamperPlaceDto>[]) {
    const typeChanged = changes.some(c => c.original.type!.id !== c.updated.type!.id);
    const updatedRows = changes.map(c => c.updated);

    if (typeChanged) {
      this.popupService.openConfirmationPopup(this.typeChangeData(updatedRows));
    } else {
      this.popupService.openConfirmationPopup(this.defaultChangeData(updatedRows));
    }
  }

  private typeChangeData(updatedRows: CamperPlaceDto[]): ConfirmationData {
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

  private defaultChangeData(updatedRows: CamperPlaceDto[]): ConfirmationData {
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
        onValueChange: (newType: CamperPlaceTypeDto, group) => {
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
