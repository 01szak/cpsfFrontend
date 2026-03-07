import { Component, Input, inject } from '@angular/core';
import { CamperPlaceForTable } from '../../../../Interface/CamperPlaceForTable';
import { CamperPlaceType } from '../../../../Interface/CamperPlaceType';
import { CamperPlaceService } from '../../../../../service/CamperPlaceService';
import { FormFieldDeclaration, SettingsFormComponent } from '../settings-form-component/settings-form.component';

@Component({
  selector: 'app-camper-place-form',
  standalone: true,
  imports: [SettingsFormComponent],
  template: `
    <app-settings-form-component
      [displayedColumns]="displayedColumns"
      [formDeclaration]="formFieldsDeclaration"
      [data]="camperPlaces"
      [service]="camperPlaceService"
    />
  `,
  styles: [``]
})
export class CamperPlaceFormComponent {
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
  protected displayedColumns = ['index', 'type', 'price'];
  protected formFieldsDeclaration: FormFieldDeclaration[] = [];

  private updateFormDeclaration() {
    this.formFieldsDeclaration = [
      { columnDef: 'index', headerName: 'Indeks', rowType: 'input', valueType: 'text' },
      {
        columnDef: 'type',
        headerName: 'Rodzaj',
        rowType: 'select',
        selectData: this._camperPlaceTypes,
        displayKey: 'typeName',
      },
      { columnDef: 'price', headerName: 'Cena', rowType: 'input', valueType: 'number' },
    ];
  }
}
