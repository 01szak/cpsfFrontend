import {Component, Input} from '@angular/core';
import {CamperPlaceType} from '../../../../Interface/CamperPlaceType';
import {
  FormFieldDeclaration,
  SettingsFormComponent
} from '../settings-form-component/settings-form.component';
import {CamperPlaceTypeService} from '../../../../../service/CamperPlaceTypeService';

@Component({
  selector: 'app-camper-place-type-form',
  imports: [
    SettingsFormComponent
  ],
  templateUrl: './camper-place-type-form.component.html',
  styleUrl: './camper-place-type-form.component.css'
})
export class CamperPlaceTypeFormComponent
  extends SettingsFormComponent<CamperPlaceType, CamperPlaceTypeService> {

  protected formFieldsDeclaration: FormFieldDeclaration[] = [
    {columnDef: 'typeName', headerName: 'Nazwa', rowType: 'input', valueType: 'text' },
    {columnDef: 'price', headerName: 'Cena', rowType: 'input', valueType: 'number' },
  ]
  protected dispColumns =  this.formFieldsDeclaration.map(f => f.columnDef);

  constructor(protected camperPlaceTypeService: CamperPlaceTypeService) {
    super();
    super.service = camperPlaceTypeService;
  }

  @Input() set camperPlaceTypes(value: CamperPlaceType[] | null) {
    if (value) {
      super.data = value;
    }
  }

}
