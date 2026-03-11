import { Component, Input, ViewChild } from '@angular/core';
import { CamperPlaceType } from '../../../../../Interface/CamperPlaceType';
import { FormFieldDeclaration, SettingsFormComponent } from '../settings-form.component';
import { CamperPlaceTypeService } from '../../../../../../service/CamperPlaceTypeService';
import { take } from 'rxjs';

@Component({
  selector: 'app-camper-place-type-form',
  standalone: true,
  imports: [SettingsFormComponent],
  template: `
    <app-settings-form-component
      #settingsForm
      [displayedColumns]="dispColumns"
      [formDeclaration]="formFieldsDeclaration"
      [data]="camperPlaceTypes"
      (saveRequest)="onSave($any($event))"
    />
  `,
  styles: [``]
})
export class CamperPlaceTypeFormComponent {
  @ViewChild('settingsForm') settingsForm!: SettingsFormComponent<CamperPlaceType>;
  @Input() camperPlaceTypes: CamperPlaceType[] | null = [];

  protected formFieldsDeclaration: FormFieldDeclaration[] = [
    { columnDef: 'typeName', headerName: 'Nazwa', rowType: 'input', valueType: 'text' },
    { columnDef: 'price', headerName: 'Cena', rowType: 'input', valueType: 'number' },
  ];
  protected dispColumns = this.formFieldsDeclaration.map((f) => f.columnDef);

  constructor(protected camperPlaceTypeService: CamperPlaceTypeService) {}

  onSave(changedRows: CamperPlaceType[]) {
    this.camperPlaceTypeService.update(changedRows).pipe(take(1)).subscribe({
      error: () => this.settingsForm.reset()
    });
  }
}
