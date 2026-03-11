import { Component, Input, inject, ViewChild } from '@angular/core';
import { CamperPlaceForTable } from '../../../../../Interface/CamperPlaceForTable';
import { CamperPlaceType } from '../../../../../Interface/CamperPlaceType';
import { CamperPlaceService } from '../../../../../../service/CamperPlaceService';
import { FormFieldDeclaration, SettingsFormComponent } from '../settings-form.component';
import { PopupConfirmationService } from '../../../../../../service/PopupConfirmationService';
import { take } from 'rxjs';

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

  onSave(changedRows: CamperPlaceForTable[]) {
    this.popupService.openConfirmationPopup({
      title: 'Zapisywanie zmian',
      message: `Czy na pewno chcesz zapisać zmiany dla ${changedRows.length} parcel?`,
      action: () => {
        this.camperPlaceService.update(changedRows).pipe(take(1)).subscribe({
          error: () => this.settingsForm.reset()
        });
      }
    });
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
