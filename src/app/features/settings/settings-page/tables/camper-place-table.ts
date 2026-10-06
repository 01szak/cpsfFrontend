import {ChangeDetectionStrategy, Component, computed, inject, OnInit} from '@angular/core';
import {CamperPlaceService} from '@core/services/openApiWrappers/CamperPlaceService';
import {PopupFormService} from '@core/services/PopupFormService';
import {Field, RegularTableComponent} from '@shared/ui/data-table/regular-table.component';
import {CamperPlaceDto} from '../../../../api';
import {CamperPlaceTypeService} from '@core/services/openApiWrappers/CamperPlaceTypeService';

@Component({
  selector: 'app-camper-place-settings',
  standalone: true,
  imports: [RegularTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-regular-table
      [dtoData]="camperPlaceService.pageResource.value().content"
      [displayData]="mapToDisplayData()"
      [isLoading]="camperPlaceService.pageResource.isLoading()"
      [totalElements]="camperPlaceService.pageResource.value().totalElements"
      [tabColumns]="fields()"
      [pageableSignal]="camperPlaceService.pageable"
      [searchRequestSignal]="camperPlaceService.searchCriteria"
      [onRowClickFunc]="openFormPopup.bind(this)"
      [createFunc]="openFormPopup.bind(this)"
    />
  `,
})
export class CamperPlaceTable {
  protected camperPlaceService = inject(CamperPlaceService);
  protected camperPlaceTypeService = inject(CamperPlaceTypeService);
  private popupFormService = inject(PopupFormService);

  protected fields = computed<Field[]>(() => [
    {name: 'index', displayName: 'Indeks', type: 'TEXT', value: '', selectOption: this.camperPlaceService.indexes() },
    {name: 'type', displayName: 'Rodzaj', type: 'OBJECT', innerFields: [{type: 'TEXT', displayName: 'Rodzaj', name: 'typeName', value: '' }]},
    {name: 'price', displayName: 'Cena', type: 'NUMBER', value: ''},
  ]);

  protected mapToDisplayData() {
    return this.camperPlaceService.pageResource.value().content.map(c => {
      const cp = c as CamperPlaceDto;
      return {
        id: cp.id,
        index: cp.index,
        type: cp.type?.typeName ?? '',
        price: cp.price,
      };
    });
  }

  protected openFormPopup(camperPlace?: CamperPlaceDto) {
    this.popupFormService.openCamperPlaceFormPopup({camperPlace});
  }
}
