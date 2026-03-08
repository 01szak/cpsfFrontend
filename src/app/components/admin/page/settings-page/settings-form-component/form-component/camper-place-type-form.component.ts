import { Component, Input } from '@angular/core';
import { CamperPlaceType } from '../../../../../Interface/CamperPlaceType';
import { FormFieldDeclaration, SettingsFormComponent } from '../settings-form.component';
import { CamperPlaceTypeService } from '../../../../../../service/CamperPlaceTypeService';

@Component({
  selector: 'app-camper-place-type-form',
  standalone: true,
  imports: [SettingsFormComponent],
  template: `
    <app-settings-form-component
      [displayedColumns]="dispColumns"
      [formDeclaration]="formFieldsDeclaration"
      [data]="camperPlaceTypes"
      [service]="camperPlaceTypeService"
    />
  `,
  styles: [``]
})
export class CamperPlaceTypeFormComponent {
  @Input() camperPlaceTypes: CamperPlaceType[] | null = [];

  protected formFieldsDeclaration: FormFieldDeclaration[] = [
    { columnDef: 'typeName', headerName: 'Nazwa', rowType: 'input', valueType: 'text' },
    { columnDef: 'price', headerName: 'Cena', rowType: 'input', valueType: 'number' },
  ];
  protected dispColumns = this.formFieldsDeclaration.map((f) => f.columnDef);

  constructor(protected camperPlaceTypeService: CamperPlaceTypeService) {}
}
