import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CamperPlaceService} from '@features/settings/services/CamperPlaceService';
import {CamperPlaceTypeService} from '@features/settings/services/CamperPlaceTypeService';
import {CamperPlaceSettingsComponent} from './settings-form-component/form-component/camper-place-settings.component';
import {MatCard} from '@angular/material/card';
import {CamperPlaceTypeSettingsComponent} from './settings-form-component/form-component/camper-place-type-settings.component';

@Component({
  selector: 'settings-page',
  imports: [
    CommonModule,
    CamperPlaceSettingsComponent,
    MatCard,
    CamperPlaceTypeSettingsComponent
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css',
  standalone: true,
})
export class SettingsPage {

  protected camperPlaces$ = this.camperPlaceService.camperPlacesForTable$;
  protected camperPlaceTypes$ = this.camperPlaceTypeService.camperPlaceType$;

  constructor(
    private camperPlaceService: CamperPlaceService,
    private camperPlaceTypeService: CamperPlaceTypeService
  ) {}
}
