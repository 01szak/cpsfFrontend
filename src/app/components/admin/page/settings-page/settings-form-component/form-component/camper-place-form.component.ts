import { Component, Input, inject, ViewChild } from '@angular/core';
import { CamperPlaceForTable } from '../../../../../Interface/CamperPlaceForTable';
import { CamperPlaceType } from '../../../../../Interface/CamperPlaceType';
import { CamperPlaceService } from '../../../../../../service/CamperPlaceService';
import { FormFieldDeclaration, RowChange, SettingsFormComponent } from '../settings-form.component';
import { PopupConfirmationService } from '../../../../../../service/PopupConfirmationService';
import { take } from 'rxjs';
import {ConfirmationData} from '../../../../popups/popup-confirmation/popup-confirmation.component';

@Component({
  selector: 'app-camper-place-form',
  standalone: true,
  imports: [SettingsFormComponent],
  template: `
    <app-settings-form-component
      #settingsForm
      [displayedColumns]="displayedColumns"
      [formDeclaration]="formFieldsDeclaration"
      [data]="camperPlaces"
      (saveRequest)="onSave($any($event))"
    />
  `,
  styles: [``]
})
export class CamperPlaceFormComponent {
  @ViewChild('settingsForm') settingsForm!: SettingsFormComponent<CamperPlaceForTable>;

  private _camperPlaces: CamperPlaceForTable[] | null = [];
  @Input() set camperPlaces(value: CamperPlaceForTable[] | null) {
    this._camperPlaces = value;
    this.updateFormDeclaration();
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

  protected displayedColumns = ['index', 'type', 'price'];
  protected formFieldsDeclaration: FormFieldDeclaration[] = [];

  onSave(changes: RowChange<CamperPlaceForTable>[]) {
    const typeChanged = changes.some(c => c.original.type.id !== c.updated.type.id);
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
